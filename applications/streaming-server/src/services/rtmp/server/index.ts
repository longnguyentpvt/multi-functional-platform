import { createServer, Server, Socket } from "net";

import logger from "@app/utils/logger";

import RtmpSession from "./session";

export default class RtmpServer {
  private server: Server;

  private port: number;

  private sessions: Record<string, RtmpSession>;

  constructor(port: number) {
    this.port = port;
    this.server = createServer((socket: Socket) => this.onClientConnect(socket));
    this.sessions = {};
  }

  public start(): void {
    this.server.listen(this.port, () => {
      logger.info(`RTMP server is listening on port ${ this.port }`);
    });
  }

  private onClientConnect(socket: Socket): void {
    logger.debug("New client connected");

    const session = new RtmpSession(socket);
    this.sessions[session.id] = session;
    session.on("connect", () => {
      logger.debug("RTMP session connected");
    });

    session.on("close", () => {
      logger.debug("RTMP session closed");
      session.close();
      delete this.sessions[session.id];
    });

    session.on("error", (error: Error) => {
      logger.error("RTMP session error:", error);
      session.close();
      delete this.sessions[session.id];
    });
  }
}
