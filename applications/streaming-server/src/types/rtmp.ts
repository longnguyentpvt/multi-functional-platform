type InvokePacket = {
  methodName: string;
  transactionId: number;
  streamName: string;
};

type PublishingType = "live" | "record" | "append";

export {
  InvokePacket,
  PublishingType
};
