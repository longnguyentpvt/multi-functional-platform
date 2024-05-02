import RtmpServer from "./services/rtmp/server";
import RtmpClient from "./services/rtmp/client";

const server = new RtmpServer(1935);
server.start();

// Create an instance of the RTMP client
const client = new RtmpClient("localhost", 1935, "hello");

// Connect the client to the server
client.connect();
