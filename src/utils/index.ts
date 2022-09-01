/* eslint-disable @typescript-eslint/no-var-requires */
import {
  ProviderCredentials,
  Providers,
  Client,
  Balance,
  Contracts,
} from '../@types/index';
import Web3 from 'web3';

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
        const res = (await service.getBalance()) as Balance;
        const web3 = new Web3(Web3.givenProvider || 'ws://localhost:8545');
        res.forEach((e, i) => {
          const foundElement = balance.find(
            (element) => element.asset === e.asset
          );
          if (!foundElement) {
            balance.push(e);
          } else {
            const index = balance.indexOf(foundElement);
            const totalBalanceInWei = web3.utils.toWei(e.balance, 'ether');
            const foundElementInWei = web3.utils.toWei(
              foundElement.balance,
              'ether'
            );
            const newBalance = web3.utils
              .toBN(totalBalanceInWei)
              .add(web3.utils.toBN(foundElementInWei))
              .toString();
            balance[index].balance = web3.utils.fromWei(newBalance, 'ether');
            balance[index].detail.push(...e.detail);
          }
        });
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
