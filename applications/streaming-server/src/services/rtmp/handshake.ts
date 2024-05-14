import { WebSocket } from "ws";
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
  public static async clientHandshake(socket: WebSocket): Promise<boolean> {
    // C0
    const c0 = Buffer.alloc(1);
    c0.writeUInt8(RTMP_VERSION, 0);
    socket.send(c0);

    // C1
    const c1 = this.getRandomData();
    socket.send(c1);

    // Read the combined S0+S1+S2 message
    const serverResponse = await this.readData(socket, 1 + HANDSHAKE_SIZE * 2);

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
    socket.send(c2);

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
  public static async serverHandshake(socket: WebSocket): Promise<boolean> {
    // Read C0 and C1
    const c0 = await this.readData(socket, 1);
    if (c0.readUInt8(0) !== RTMP_VERSION) {
      throw new Error("Invalid RTMP version");
    }

    const c1 = await this.readData(socket, HANDSHAKE_SIZE);

    // S0
    const s0 = Buffer.alloc(1);
    s0.writeUInt8(RTMP_VERSION, 0);

    // S1
    const s1 = this.getRandomData();

    // S2 (echo of C1)
    const s2 = c1;

    // Combine S0, S1, and S2 into a single buffer
    const response = Buffer.concat([s0, s1, s2]);

    // Send the combined response to the client
    socket.send(response);

    // Read C2
    const c2 = await this.readData(socket, HANDSHAKE_SIZE);
    if (!c2.equals(s1)) {
      throw new Error("Handshake failed: C2 does not match S1");
    }

    logger.debug("serverHandshake completed");
    return true; // Handshake completed successfully
  }

  private static async readData(socket: WebSocket, size: number): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      let data = Buffer.alloc(0);

      const onData = (chunk: Buffer): void => {
        data = Buffer.concat([data, chunk]);
        if (data.length === size) {
          resolve(data);
        }
      };

      socket.once("message", onData);
      socket.once("error", reject);
    });
  }

  private static getRandomData(): Buffer {
    return crypto.randomBytes(HANDSHAKE_SIZE);
  }
}
