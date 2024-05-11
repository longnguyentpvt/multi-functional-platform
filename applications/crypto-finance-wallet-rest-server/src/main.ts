import { NestFactory } from "@nestjs/core";

import AppModule from "@app/modules/app.module";

import { AllExceptionFilter } from "@app/exceptions/filter.exception";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new AllExceptionFilter());
  await app.listen(3000);
}

bootstrap();
