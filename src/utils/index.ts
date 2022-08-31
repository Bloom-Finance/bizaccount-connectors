/* eslint-disable @typescript-eslint/no-var-requires */
import {
  ProviderCredentials,
  Providers,
  Client,
  Balance,
  Contracts,
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
const getSupportedContracts = () => {
  const obj = require('../contracts.json');
  return obj.tokens as Contracts;
};
const getContractsBalance = async (contracts: Contracts) => {
  //staff
};
const manageBaseUrl = (connection: ProviderCredentials): string => {
  let url = '';
  if (!connection.provider.useTestnet) {
    url = setProdUrl(connection.provider.id);
  } else {
    url = setTestUrl(connection.provider.id);
  }
  if (connection.chain === 'goerli' || connection.chain === 'rinkeby') {
    url = url.replace('api', `api-${connection.chain}`);
  }
  return url;
  //staff this function to return the base url
};
const setProdUrl = (provider: Providers) => {
  switch (provider) {
    case 'binance':
      return 'https://api.binance.com';
    case 'etherscan':
      return 'https://api.etherscan.io/api';
    default:
      return 'https://api.etherscan.io/api';
  }
};
const setTestUrl = (provider: Providers) => {
  switch (provider) {
    case 'binance':
      return 'https://testnet.binance.vision';
    case 'etherscan':
      return 'https://api.etherscan.io/api';
    default:
      return 'https://api.etherscan.io/api';
  }
};
export { setClient, getDescription, manageBaseUrl, getSupportedContracts };
