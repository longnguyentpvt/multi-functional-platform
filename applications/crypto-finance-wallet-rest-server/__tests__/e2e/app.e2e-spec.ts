import * as request from "supertest";
import { App } from "supertest/types";
import { Test } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";

import AppModule from "@app/modules/app.module";

describe("AppController (e2e)", () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it("/ (GET)", () => request(app.getHttpServer())
    .get("/")
    .expect(200)
    .expect("Hello World!"));
});
