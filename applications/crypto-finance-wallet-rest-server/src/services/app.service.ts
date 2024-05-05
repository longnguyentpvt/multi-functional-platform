import { Injectable } from "@nestjs/common";

import BlockchainWallet from "@app/services/blockchain/blockchain-wallet";

@Injectable()
export default class AppService {
  async getBalance(privateKey: string): Promise<bigint> {
    const wallet = BlockchainWallet.withAccount(
      privateKey,
      "bsc"
    );

    const balance = await wallet.balanceOf("0x55d398326f99059fF775485246999027B3197955");
    console.log("Token Balance return:", balance);

    return balance;
  }
}
