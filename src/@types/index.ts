/* eslint-disable @typescript-eslint/no-namespace */
export interface IConnector {
  getClient<T extends Providers>(
    credentials: ProviderCredentials<T>,
    providerType: T,
    config?: ConnectorConfig
  ): Client<
    T extends 'binance' ? 'binance' : T extends 'stripe' ? 'stripe' : 'metamask'
  >;
}
export interface Client<A extends Providers> {
  provider: A;
  credentials: ProviderCredentials<A>;
  getBalance(): Promise<{ asset: string; balance: string }[]>;
}
export interface IProviderConnector {
  // asset, description , balance
  getBalance(): Promise<{ asset: string; balance: string }[]>;
}

export type ProviderCredentials<T extends Providers> = T extends 'binance'
  ? Binance.credentials
  : T extends 'metamask'
  ? Metamask.credentials
  : Stripe.credentials;
export type Providers = 'binance' | 'metamask' | 'stripe';
export type ConnectorConfig = {
  useTestnet: boolean;
};
export namespace Binance {
  export interface credentials {
    apiKey: string;
    apiSecret: string;
  }
}

export namespace Metamask {
  export interface credentials {
    test: '';
  }
}

export namespace Stripe {
  export interface credentials {
    test: '';
  }
}
