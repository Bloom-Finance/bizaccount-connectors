/* eslint-disable @typescript-eslint/no-namespace */
export interface IConnector {
  getClient(providerConnection: ProviderCredentials[]): Client;
}
export interface Client {
  getBalance(): Promise<Balance>;
  getProvider(id: Providers);
  getTransactionHistory(config: {
    startingBlock: number;
    order?: 'asc' | 'desc';
  }): Promise<Transaction[]>;
  getCurrenciesPricesInUSDC(
    assets: Assets[],
    startDate: number,
    endDate: number
  ): Promise<Prices>;
  providers: ProviderCredentials[];
}
export interface IProviderConnector {
  getBalance(): Promise<
    {
      asset: string;
      balance: string;
      description: string;
      detail: Array<{
        address: string;
        provider: string;
        chain: string;
        balance: string;
      }>;
    }[]
  >;
}
export type Contracts = {
  token: 'USDT' | 'DAI';
  networks: {
    chain: Chains;
    address: string;
  }[];
}[];
export type ProviderCredentials = {
  addresses?: string[];
  chain: Chains;
  provider: {
    id: Providers;
    useTestnet: boolean;
    auth: {
      apiKey?: string;
      apiSecret?: string;
    };
  };
};
export type Providers = 'binance' | 'etherscan' | 'coinbase';
export type Chains = 'bsc' | 'goerli' | 'rinkeby' | 'erc20';
export type Assets = 'eth' | 'usdt' | 'dai' | 'btc';

export type Balance = {
  asset: string;
  balance: string;
  description: string;
  detail: Array<{
    address?: string;
    provider: string;
    chain?: string;
    balance: string;
  }>;
}[];
export type Transaction = {
  asset: string;
  from: string;
  to: string;
  amount: string;
  status: 'in' | 'out';
  timestamp: number;
  chain?: Chains;
  provider: Providers;
  block: string;
  gas?: string;
  gasPrice?: string;
  gasUsed?: string;
  amountInUSDC?: string;
};

export type Prices = {
  date: number;
  high: string;
  low: string;
  close: string;
  volume: string;
  asset: Assets;
}[];
export type PoloniexPrice = {
  date: string;
  high: string;
  low: string;
  open: string;
  close: string;
  volume: string;
  quoteVolume: string;
  weightedAverage: string;
};
