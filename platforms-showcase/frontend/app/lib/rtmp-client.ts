import crypto from "crypto";

const RTMP_VERSION = 3;
const HANDSHAKE_SIZE = 1536;
type PublishingType = "live" | "record" | "append";

export default class RtmpClient {
  private socket: WebSocket;

  private streamName: string;

  constructor(streamName: string) {
    this.streamName = streamName;
    this.socket = new WebSocket("ws://localhost:1935");
    this.socket.addEventListener("open", () => {
      this.handshake();
    });
  }

  private async handshake(): Promise<void> {
    // C0
    const c0 = Buffer.alloc(1);
    c0.writeUInt8(RTMP_VERSION, 0);
    this.socket.send(c0);

    // C1
    const c1 = crypto.randomBytes(HANDSHAKE_SIZE);
    this.socket.send(c1);

    // Read the combined S0+S1+S2 message
    const serverResponse = await this.readData(1 + HANDSHAKE_SIZE * 2);

    // Extract S0, S1, and S2 from the server response
    const s0 = serverResponse.subarray(0, 1);
    const s1 = serverResponse.subarray(1, 1 + HANDSHAKE_SIZE);
    const s2 = serverResponse.subarray(1 + HANDSHAKE_SIZE);

    // Verify S0
    if (s0.readUInt8(0) !== RTMP_VERSION) {
      throw new Error("Invalid RTMP version");
    }

    // Verify S2 matches C1
    if (!s2.equals(c1)) {
      throw new Error("Handshake failed: S2 does not match C1");
    }

    // C2
    const c2 = s1;
    this.socket.send(c2);

    console.debug("clientHandshake completed");
  }

  public publish(): void {
    // Send publish command
    const publishCommand = this.createPublishCommand();
    this.socket.send(publishCommand);

    // Handle server's response
    this.socket.addEventListener("message", () => {
      // Parse server's response
      // If the response is successful, start sending video data
      console.debug("Publishing stream");
      // Implement sending video data to the server
    });
  }

  public play(): void {
    // Send play command
    const playCommand = this.createPlayCommand();
    this.socket.send(playCommand);

    // Handle server's response
    this.socket.addEventListener("data", () => {
    // Parse server's response
    // If the response is successful, start receiving video data
      console.debug("Playing stream");
    // Implement receiving video data from the server
    });
  }

  public disconnect(): void {
    // Close the socket connection
    this.socket.close();
    console.debug("Disconnected from RTMP server");
  }

  private createPublishCommand(): Buffer {
    const transactionId = new Date().valueOf(); // TODO: Assign a unique transaction ID
    const publishingName = this.streamName;
    const publishingType: PublishingType = "live";

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

  private async readData(size: number): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      let data = Buffer.alloc(0);

      const onData = (e: MessageEvent): void => {
        data = Buffer.concat([data, e.data]);
        if (data.length === size) {
          this.socket.removeEventListener("message", onData);
          resolve(data);
        }
      };

      this.socket.addEventListener("message", onData);
      this.socket.addEventListener("error", reject);
    });
  }
}
