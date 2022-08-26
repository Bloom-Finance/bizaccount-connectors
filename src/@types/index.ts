export interface IConnector {
  getClient(): Client;
}
export interface Client {
  getBalance(): Promise<{
    totalBalance: number;
    fiat: number;
    crypto: number;
  }>;
}
