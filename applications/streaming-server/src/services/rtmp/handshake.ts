import { Socket } from "net";

export default class RtmpHandshake {
  public static async performHandshake(socket: Socket): Promise<void> {
    await this.sendC0C1(socket);
    await this.readS0S1S2(socket);
    await this.sendC2(socket);
  }

  private static async sendC0C1(socket: Socket): Promise<void> {
    const c0 = Buffer.from([0x03]); // RTMP version
    const c1 = Buffer.alloc(1536); // Handshake payload
    c1.writeUInt32BE(0, 0); // Timestamp
    c1.writeUInt32BE(0, 4); // Zero
    socket.write(Buffer.concat([c0, c1]));
  }

  private static async readS0S1S2(socket: Socket): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
      const expectedLength = 1 + 1536 + 1536;
      let data = Buffer.alloc(0);

      const onData = (chunk: Buffer): void => {
        data = Buffer.concat([data, chunk]);
        if (data.length >= expectedLength) {
          socket.removeListener("data", onData);
          resolve(data);
        }
      };

      socket.on("data", onData);
      socket.once("error", reject);
    });
  }

  private static async sendC2(socket: Socket): Promise<void> {
    const s1 = await this.readS0S1S2(socket);
    const c2 = s1.subarray(1, 1537);
    socket.write(c2);
  }
}
