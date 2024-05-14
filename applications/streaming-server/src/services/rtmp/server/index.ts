import { createServer, Server as HttpServer } from "http";
import { Server as WebSocketServer, WebSocket } from "ws";

import logger from "@app/utils/logger";

import RtmpSession from "./session";

export default class RtmpServer {
  private server: WebSocketServer;

  private port: number;

  private sessions: Record<string, RtmpSession>;

  constructor(port: number) {
    this.port = port;
    this.sessions = {};
  }

  public start(): void {
    const httpServer: HttpServer = createServer();
    this.server = new WebSocketServer({ server: httpServer });
    this.server.on("connection", (socket: WebSocket) => {
      this.onClientConnect(socket);
    });
    httpServer.listen(this.port, () => {
      logger.info("Server is running on port 3000");
    });
  }

  private onClientConnect(socket: WebSocket): void {
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
