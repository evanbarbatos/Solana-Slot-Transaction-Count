import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { Connection } from '@solana/web3.js';

describe('SolanaController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /solana/transaction-count returns count and calls RPC', async () => {
    const slot = 123;
    const getBlockSpy = jest
      .spyOn(Connection.prototype, 'getBlock')
      .mockResolvedValue({ transactions: [1, 2, 3] } as any);

    const res = await request(app.getHttpServer())
      .post('/solana/transaction-count')
      .send({ block: slot })
      .expect(200);

    expect(res.body).toEqual({ slot, transactionCount: 3 });
    expect(getBlockSpy).toHaveBeenCalledWith(slot, expect.any(Object));

    getBlockSpy.mockRestore();
  });
});