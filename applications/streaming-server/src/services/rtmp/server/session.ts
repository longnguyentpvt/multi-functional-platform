import { Socket } from "net";
import { EventEmitter } from "events";

import AMFReader from "@app/utils/amf-reader";
import logger from "@app/utils/logger";

import { Rtmp } from "@app/types";

import RtmpHandshake from "../handshake";

export default class RtmpSession extends EventEmitter {
  private socket: Socket;

  private sessionId: string;

  private publishingClients: Record<string, Socket>;

  private playingClients: Record<string, Socket[]>;

  constructor(socket: Socket) {
    super();
    this.socket = socket;
    this.sessionId = this.generateSessionId();
    this.publishingClients = {};
    this.playingClients = {};

    this.socket.on("data", () => this.onSocketData.bind(this));
    this.socket.on("close", () => this.onSocketClose.bind(this));
    this.socket.on("error", () => this.onSocketError.bind(this));

    this.handshake();
  }

  public get id(): string {
    return this.sessionId;
  }

  private generateSessionId(): string {
    return Math.random().toString(36).substring(7);
  }

  private async handshake(): Promise<void> {
    try {
      await RtmpHandshake.performHandshake(this.socket);
      this.emit("connect");
    } catch (error: unknown) {
      logger.error("Handshake failed:", { error });
      this.socket.destroy();
    }
  }

  private onSocketData(data: Buffer): void {
    // Parse RTMP packets
    let offset = 0;
    while (offset < data.length) {
      const headerSize = 1;
      const packetLength = data.readUInt32BE(offset + headerSize + 3);
      const packetType = data.readUInt8(offset + 1);
      const packetData = data.slice(offset + headerSize + 11, offset + headerSize + 11 + packetLength);

      switch (packetType) {
      // Invoke
        case 0x14: {
          const invokeData = this.parseInvokePacket(packetData);
          switch (invokeData.methodName) {
            case "publish":
              this.handlePublishCommand(invokeData);
              break;
            case "play":
              this.handlePlayCommand(invokeData);
              break;
              // Handle other invoke commands
            default:
              logger.error(`Unknown invoke command: ${ invokeData.methodName }`);
          }
          break;
        }
        // Handle other packet types
        default:
          break;
      }

      offset += headerSize + 11 + packetLength;
    }
  }

  private parseInvokePacket(data: Buffer): Rtmp.InvokePacket {
    const amfReader = new AMFReader(data);

    // Read the AMF0 string for the method name
    const methodName: string = amfReader.readString();

    // Read the transaction ID (number)
    const transactionId: number = amfReader.readNumber();

    // Read the command object
    const commandObject = amfReader.readObject();

    // Extract the stream name from the command object
    const streamName = commandObject.streamName as string || "";

    return {
      methodName,
      transactionId,
      streamName
    };
  }

  private onSocketClose(): void {
    // Remove event listeners
    this.socket.removeAllListeners();
    // Emit 'close' event
    this.emit("close");
  }

  private onSocketError(error: Error): void {
    // Handle socket error event
    logger.error("Socket error:", error);
    // Perform error handling tasks
    this.close();
  }

  private handlePublishCommand(invokeData: Rtmp.InvokePacket): void {
    const { streamName } = invokeData;
    logger.debug(`Received publish command for stream: ${ streamName }`);

    // Check if the stream is already being published
    if (this.publishingClients[streamName]) {
      logger.debug(`Stream ${ streamName } is already being published`);
      return;
    }

    // Store the publishing client's information
    this.publishingClients[streamName] = this.socket;

    // Prepare to receive video data
    this.socket.on("data", (data: Buffer) => {
      this.handleVideoData(streamName, data);
    });

    this.emit("publish", streamName);
  }

  private handlePlayCommand(invokeData: Rtmp.InvokePacket): void {
    const { streamName } = invokeData;
    logger.debug(`Received play command for stream: ${ streamName }`);

    // Check if the requested stream is available
    if (!this.publishingClients[streamName]) {
      logger.debug(`Stream ${ streamName } is not available`);
      return;
    }

    // Add the playing client to the list of clients playing the stream
    if (!this.playingClients[streamName]) {
      this.playingClients[streamName] = [];
    }
    this.playingClients[streamName].push(this.socket);

    this.emit("play", streamName);
  }

  private handleVideoData(streamName: string, data: Buffer): void {
    // Broadcast the video data to all playing clients for the given stream
    const clients = this.playingClients[streamName];
    if (clients) {
      clients.forEach((client) => {
        client.write(data);
      });
    }
  }

  // .
  public publish(streamName: string): void {
    // Store stream metadata
    // Forward stream to other clients
    this.emit("publish", streamName);
  }

  public play(streamName: string): void {
    // Handle stream playback logic
    // Locate the stream
    // Send stream data to the client
    this.emit("play", streamName);
  }

  public close(): void {
    // Close the RTMP session
    this.socket.destroy();
  }
}
