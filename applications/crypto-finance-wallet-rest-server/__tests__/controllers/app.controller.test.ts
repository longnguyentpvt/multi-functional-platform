import { Test, TestingModule } from "@nestjs/testing";

import AppController from "@app/controllers/app.controller";

import AppService from "@app/services/app.service";

describe("AppController", () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService]
    }).compile();
  });

  describe("getBalance", () => {
    it("should return balance", async () => {
      const appController = app.get(AppController);
      const rp = await appController.getBalance("8d77aaf254aa279f3181ec59ced047b195d3452e029f93ff9da3a36dab335d11");
      expect(rp).toEqual({ balance: "0" });
    });
  });
});
