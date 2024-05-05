export interface IBlockchainWallet {
  send(receiverAddress: string, amount: number): Promise<void>;
  balanceOf(tokenAddress: string): Promise<bigint>;
}
