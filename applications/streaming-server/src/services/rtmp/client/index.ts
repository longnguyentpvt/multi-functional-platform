import { Socket } from "net";

import logger from "@app/utils/logger";

import { Rtmp } from "@app/types";

import RtmpHandshake from "../handshake";

export default class RtmpClient {
  private socket: Socket;

  private serverUrl: string;

  private serverPort: number;

  private streamName: string;

  constructor(serverUrl: string, serverPort: number, streamName: string) {
    this.serverUrl = serverUrl;
    this.serverPort = serverPort;
    this.streamName = streamName;
    this.socket = new Socket();
  }

  public connect(): void {
    this.socket.connect(this.serverPort, this.serverUrl, () => {
      logger.info("Connected to RTMP server");
      this.handshake();
    });
  }

  private async handshake(): Promise<void> {
    await RtmpHandshake.clientHandshake(this.socket);
  }

  public publish(): void {
    // Send publish command
    const publishCommand = this.createPublishCommand();
    this.socket.write(publishCommand);

    // Handle server's response
    this.socket.once("data", (data: Buffer) => {
    // Parse server's response
    // If the response is successful, start sending video data
      logger.debug("Publishing stream", { dataLen: data.length });
    // Implement sending video data to the server
    });
  }

  public play(): void {
    // Send play command
    const playCommand = this.createPlayCommand();
    this.socket.write(playCommand);

    // Handle server's response
    this.socket.once("data", (data: Buffer) => {
    // Parse server's response
    // If the response is successful, start receiving video data
      logger.debug("Playing stream", { dataLen: data.length });
    // Implement receiving video data from the server
    });
  }

  public disconnect(): void {
    // Close the socket connection
    this.socket.destroy();
    logger.debug("Disconnected from RTMP server");
  }

  private createPublishCommand(): Buffer {
    const transactionId = new Date().valueOf(); // TODO: Assign a unique transaction ID
    const publishingName = this.streamName;
    const publishingType: Rtmp.PublishingType = "live";

    const commandObject = {
      cmd: "publish",
      transId: transactionId,
      cmdObj: {
        publishingName,
        publishingType
      }
    };

    const commandJSON = JSON.stringify(commandObject);
    const commandLength = commandJSON.length;

    const buffer = Buffer.alloc(commandLength + 4);
    buffer.writeUInt32BE(commandLength, 0);
    buffer.write(commandJSON, 4);

    return buffer;
  }

  private createPlayCommand(): Buffer {
    const transactionId = new Date().valueOf(); // TODO: Assign a unique transaction ID

    const playingName = this.streamName;
    const start = -2; // -2 means live stream, -1 means whole stream, >=0 means start from that timestamp

    const commandObject = {
      cmd: "play",
      transId: transactionId,
      cmdObj: {
        playingName,
        start
      }
    };

    const commandJSON = JSON.stringify(commandObject);
    const commandLength = commandJSON.length;

    const buffer = Buffer.alloc(commandLength + 4);
    buffer.writeUInt32BE(commandLength, 0);
    buffer.write(commandJSON, 4);

    return buffer;
  }
}
