/* eslint-disable @typescript-eslint/no-var-requires */
import {
  ProviderCredentials,
  Providers,
  Client,
  Balance,
} from '../@types/index';

const setClient = (providerConnection: ProviderCredentials[]): Client => {
  const providers = providerConnection;
  return {
    providers,
    getProvider(id) {
      //staff this function to return the provider object
    },
    async getBalance() {
      const balance: Balance = [];
      for (const connection of providerConnection) {
        const {
          ProviderConnectorImpl,
        } = require(`../impl/${connection.provider.id}/index`);
        const service = new ProviderConnectorImpl(connection);
        const balances = await service.getBalance();
        balance.push(...balances);
      }
      return balance;
    },
  };
};
const getDescription = (asset: string) => {
  const obj = require('../cryptocurrencies.json');
  const myKeys = Object.keys(obj);
  const foundKey = myKeys.find((e) => e === asset);
  if (!foundKey) return '';
  return obj[foundKey];
};
const manageBaseUrl = (connection: ProviderCredentials): string => {
  if (!connection.provider.useTestnet) {
    return setProdUrl(connection.provider.id);
  }
  return setTestUrl(connection.provider.id);
  //staff this function to return the base url
};
const setProdUrl = (provider: Providers) => {
  switch (provider) {
    case 'binance':
      return 'https://api.binance.com';
    default:
      return 'https://api.binance.com';
  }
};
const setTestUrl = (provider: Providers) => {
  switch (provider) {
    case 'binance':
      return 'https://testnet.binance.vision';
    default:
      return 'https://api.binance.com';
  }
};
export { setClient, getDescription, manageBaseUrl };
