import { testUtil } from "@app/utils";

import { TEST_DATA } from "@app/data";

const main = (): void => {
  const test = {
    name: "Test"
  };

  console.log("Start", TEST_DATA, test);

  testUtil();
};

main();
