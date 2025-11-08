import { Controller, Post, Body, BadRequestException, HttpCode } from '@nestjs/common';
import { SolanaService } from './solana.service';

@Controller('solana')
export class SolanaController {
  constructor(private readonly solanaService: SolanaService) {}

  @Post('transaction-count')
  @HttpCode(200)
  async transactionCount(@Body('block') block: number) {
    if (typeof block !== 'number' || !Number.isInteger(block) || block < 0) {
      throw new BadRequestException('Invalid block number');
    }
    return await this.solanaService.getTransactionCountForBlock(block);
  }
}