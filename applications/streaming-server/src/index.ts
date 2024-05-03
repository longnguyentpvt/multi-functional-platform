import RtmpServer from "./services/rtmp/server";
import RtmpClient from "./services/rtmp/client";
import logger from "./utils/logger";

const args = process.argv.slice(2);

const type = args.join();
switch (type) {
  case "--server": {
    logger.debug("Running in server mode");
    const server = new RtmpServer(1935);
    server.start();
    break;
  }
  case "--client": {
    logger.debug("Running in client mode");
    const client = new RtmpClient("localhost", 1935, "hello");
    client.connect();
    break;
  }
  default:
    break;
}
