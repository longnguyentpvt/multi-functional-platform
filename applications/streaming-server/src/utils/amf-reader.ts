export default class AMFReader {
  private buffer: Buffer;

  private offset: number;

  constructor(buffer: Buffer) {
    this.buffer = buffer;
    this.offset = 0;
  }

  private read(length: number): Buffer {
    const value = this.buffer.subarray(this.offset, this.offset + length);
    this.offset += length;
    return value;
  }

  public readUint8(): number {
    return this.read(1).readUInt8(0);
  }

  public readUint16(): number {
    return this.read(2).readUInt16BE(0);
  }

  public readUint32(): number {
    return this.read(4).readUInt32BE(0);
  }

  public readNumber(): number {
    const marker = this.readUint8();
    if (marker === 0x00) {
      return this.read(8).readDoubleBE(0);
    }
    throw new Error("Invalid AMF number format");
  }

  public readString(): string {
    const marker = this.readUint8();
    if (marker === 0x02) {
      const length = this.readUint16();
      return this.read(length).toString("utf8");
    }
    throw new Error("Invalid AMF string format");
  }

  public readObject(): Record<string, unknown> {
    const marker = this.readUint8();
    if (marker === 0x03) {
      const obj: Record<string, unknown> = {};
      while (true) {
        const key = this.readString();
        const value = this.readValue();
        if (key === "" && value === undefined) {
          break;
        }
        obj[key] = value;
      }
      return obj;
    }
    throw new Error("Invalid AMF object format");
  }

  private readValue(): unknown {
    const marker = this.readUint8();
    switch (marker) {
      case 0x00:
        return this.readNumber();
      case 0x02:
        return this.readString();
      case 0x03:
        return this.readObject();
      case 0x05:
        return null;
      case 0x01:
        return this.readUint8() !== 0;
      default:
        throw new Error(`Unsupported AMF type: ${ marker }`);
    }
  }
}
