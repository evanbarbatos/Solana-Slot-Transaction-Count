import { Injectable } from '@nestjs/common';
import { Connection } from '@solana/web3.js';

@Injectable()
export class SolanaService {
  private connection: Connection;

  constructor() {
    const url = process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
    this.connection = new Connection(url, 'confirmed');
  }

  async getTransactionCountForBlock(slot: number): Promise<{ slot: number; transactionCount: number }> {
    const block = await this.connection.getBlock(slot, { maxSupportedTransactionVersion: 0 });
    const transactionCount = block?.transactions?.length ?? 0;
    return { slot, transactionCount };
  }
}