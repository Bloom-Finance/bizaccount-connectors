/* eslint-disable @typescript-eslint/no-var-requires */
import {
  ProviderCredentials,
  Providers,
  Client,
  Balance,
  Contracts,
} from '../@types/index';
import Web3 from 'web3';
import { cryptocurrencies } from '../data/cryptocurrencies';
import { contracts } from '../data/contracts';
import { Transaction } from '../@types/index';
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
        res.forEach((e, i) => {
          const foundElement = balance.find(
            (element) => element.asset === e.asset
          );
          if (!foundElement) {
            balance.push(e);
          } else {
            if (foundElement.asset === 'ETH') {
              const index = balance.indexOf(foundElement);
              balance[index].balance = sumEthsBalances(
                foundElement.balance,
                e.balance
              );
              balance[index].detail.push(...e.detail);
            } else {
              const index = balance.indexOf(foundElement);
              balance[index].balance += e.balance;
              balance[index].detail.push(...e.detail);
            }
          }
        });
      }
      return balance;
    },
    async getTransactionHistory() {
      const transactions: Transaction[] = [];
      for (const connection of providerConnection) {
        const {
          ProviderConnectorImpl,
        } = require(`../impl/${connection.provider.id}/index`);
        const service = new ProviderConnectorImpl(connection);
        const res = (await service.getTransactionHistory()) as Transaction[];
        res.forEach((e) => {
          transactions.push(e);
        });
      }
      return transactions;
    },
  };
};
const getDescription = (asset: string) => {
  const myKeys = Object.keys(cryptocurrencies);
  const foundKey = myKeys.find((e) => e === asset);
  if (!foundKey) return '';
  return cryptocurrencies[foundKey];
};
const getSupportedContracts = () => {
  return contracts.tokens as Contracts;
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
const sumEthsBalances = (referenceBalance: string, balanceToAdd: string) => {
  const web3 = new Web3(Web3.givenProvider || 'ws://localhost:8545');
  const totalBalanceInWei = web3.utils.toWei(referenceBalance, 'ether');
  const foundElementInWei = web3.utils.toWei(balanceToAdd, 'ether');
  const newBalance = web3.utils
    .toBN(totalBalanceInWei)
    .add(web3.utils.toBN(foundElementInWei))
    .toString();
  const formattedBalance = web3.utils.fromWei(newBalance, 'ether');
  return formattedBalance;
};
const weiToEth = (value: string) => {
  const web3 = new Web3(Web3.givenProvider || 'ws://localhost:8545');
  return web3.utils.fromWei(value, 'ether');
};
const convertERC20Token = (value: string, decimals: number) => {
  const web3 = new Web3(Web3.givenProvider || 'ws://localhost:8545');
  return web3.utils
    .toBN(value)
    .div(web3.utils.toBN(10 ** decimals))
    .toString();
};
export {
  setClient,
  getDescription,
  manageBaseUrl,
  getSupportedContracts,
  weiToEth,
  convertERC20Token,
};
