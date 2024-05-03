import { Socket } from "net";
import crypto from "crypto";

import logger from "@app/utils/logger";

const RTMP_VERSION = 3;
const HANDSHAKE_SIZE = 1536;

export default class RtmpHandshake {
  /*
  For the client-side handshake:
    The client sends the RTMP version (C0) to the server.
    The client generates random data (C1) and sends it to the server.
    The client reads the server's RTMP version (S0) and validates it.
    The client reads the server's random data (S1) and the server's response (S2).
    The client sends the server's random data back to the server (C2).
  */
  public static async clientHandshake(socket: Socket): Promise<boolean> {
    // C0
    const c0 = Buffer.alloc(1);
    c0.writeUInt8(RTMP_VERSION, 0);
    socket.write(c0);

    // C1
    const c1 = this.getRandomData();
    socket.write(c1);

    // Read S0, S1, and S2
    const s0 = await this.readData(socket, 1);
    if (s0.readUInt8(0) !== RTMP_VERSION) {
      throw new Error("Invalid RTMP version");
    }

    const s1 = await this.readData(socket, HANDSHAKE_SIZE);
    const s2 = await this.readData(socket, HANDSHAKE_SIZE);

    // Verify S2 matches C1
    if (!s2.equals(c1)) {
      throw new Error("Handshake failed: S2 does not match C1");
    }
    // C2
    const c2 = s1;
    socket.write(c2);

    logger.debug("clientHandshake completed");
    return true; // Handshake completed successfully
  }

  /*
  For the server-side handshake:
    The server reads the client's RTMP version (C0) and validates it.
    The server reads the client's random data (C1).
    The server sends its RTMP version (S0) to the client.
    The server generates random data (S1) and sends it to the client.
    The server sends the client's random data back to the client (S2).
    The server reads the client's response (C2).
  */
  public static async serverHandshake(socket: Socket): Promise<boolean> {
    // Read C0 and C1
    const c0 = await this.readData(socket, 1);
    if (c0.readUInt8(0) !== RTMP_VERSION) {
      throw new Error("Invalid RTMP version");
    }

    const c1 = await this.readData(socket, HANDSHAKE_SIZE);

    // S0
    const s0 = Buffer.alloc(1);
    s0.writeUInt8(RTMP_VERSION, 0);
    socket.write(s0);

    // S1
    const s1 = this.getRandomData();
    socket.write(s1);

    // S2 (echo of C1)
    const s2 = c1;
    socket.write(s2);

    // Read C2
    const c2 = await this.readData(socket, HANDSHAKE_SIZE);
    if (!c2.equals(s1)) {
      throw new Error("Handshake failed: C2 does not match S1");
    }

    logger.debug("serverHandshake completed");
    return true; // Handshake completed successfully
  }

  private static async readData(socket: Socket, size: number): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      let data = Buffer.alloc(0);

      const onReadable = (): void => {
        let chunk: Buffer = socket.read(size - data.length) as Buffer;
        while (chunk) {
          data = Buffer.concat([data, chunk]);
          if (data.length === size) {
            socket.removeListener("readable", onReadable);
            resolve(data);
            break;
          }
          chunk = socket.read(size - data.length) as Buffer;
        }
      };

      socket.on("readable", onReadable);
      socket.once("error", reject);
    });
  }

  private static getRandomData(): Buffer {
    return crypto.randomBytes(HANDSHAKE_SIZE);
  }
}
