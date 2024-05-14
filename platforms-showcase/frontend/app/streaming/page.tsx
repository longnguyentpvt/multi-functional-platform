// eslint-disable-next-line no-restricted-imports, import/extensions
import RtmpClient from "../lib/rtmp-client";

export default async function Page(): Promise<JSX.Element> {
  const client = new RtmpClient("platform-showcase");
  return <h1>Hello, Next.js!</h1>;
}
