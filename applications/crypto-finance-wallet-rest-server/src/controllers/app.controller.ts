import { Controller, Get, Param } from "@nestjs/common";

import AppService from "@app/services/app.service";

import ApiException from "@app/exceptions/api.exception";
import { ErrorCode } from "@app/exceptions/types";

@Controller()
export default class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getBalance(
    @Param("privateKey") privateKey: string
  ): Promise<{ balance: string }> {
    const balance = await this.appService.getBalance(privateKey);
    return { balance: balance.toString() };
  }

  @Get("/exception/uncaught/test")
  async uncaughtExcpetion(): Promise<{ test: string }> {
    throw new Error("Simulated uncaught exception");
    return { test: "test" };
  }

  @Get("/exception/badrequest/test")
  async badRequestException(): Promise<{ test: string }> {
    throw new ApiException(ErrorCode.INVALID_INPUT, "Simulated bad request exception", 400);
    return { test: "test" };
  }
}
