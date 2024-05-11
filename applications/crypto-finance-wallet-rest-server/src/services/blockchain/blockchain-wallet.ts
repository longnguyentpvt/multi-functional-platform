import Web3 from "web3";
import { Web3Account } from "web3-eth-accounts";

import { IBlockchainWallet } from "./blockchain.interface";
import { DefaultTokenABI } from "./data";
import { BlockChainNetwork } from "./types";

export default class BlockchainWallet implements IBlockchainWallet {
  privateKey: string;

  private web3: Web3;

  private account: Web3Account;

  private constructor(privateKey: string | null, network: BlockChainNetwork = "bsc-testnet") {
    switch (network) {
      case "eth":
        this.web3 = new Web3("https://mainnet.infura.io/v3/your_project_id");
        break;
      case "eth-testnet":
        this.web3 = new Web3("https://ropsten.infura.io/v3/your_project_id");
        break;
      case "bsc":
        this.web3 = new Web3("https://bsc-dataseed1.binance.org/");
        break;
      case "bsc-testnet":
      default:
        this.web3 = new Web3("https://data-seed-prebsc-1-s1.binance.org:8545/");
        break;
    }

    if (!privateKey) {
      this.account = this.web3.eth.accounts.create();
    } else {
      this.account = this.web3.eth.accounts.privateKeyToAccount(`0x${ privateKey }`);
    }

    this.privateKey = this.account.privateKey;
  }

  static withAccount(privateKey: string, network: BlockChainNetwork = "bsc-testnet"): BlockchainWallet {
    const instance = new BlockchainWallet(privateKey, network);
    return instance;
  }

  static newAccount(network: BlockChainNetwork = "bsc-testnet"): BlockchainWallet {
    return new BlockchainWallet(null, network);
  }

  async send(receiverAddress: string, amount: number): Promise<void> {
    console.debug(`Sending ${ amount } to ${ receiverAddress }`);
  }

  async balanceOf(tokenAddress: string): Promise<bigint> {
    const tokenContract = new this.web3.eth.Contract(
      DefaultTokenABI,
      tokenAddress
    );

    const balance = await tokenContract.methods.balanceOf(this.account.address).call<bigint>();
    return balance;
  }
}
