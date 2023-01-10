/* eslint-disable @typescript-eslint/no-var-requires */
import {
  ProviderCredentials,
  Providers,
  Client,
  Balance,
  Contracts,
  PoloniexPrice,
} from '../@types/index';
import Web3 from 'web3';
import { cryptocurrencies } from '../data/cryptocurrencies';
import { contracts } from '../data/contracts';
import { Transaction, Assets, Prices, Chains } from '../@types/index';
import axios from 'axios';
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
        res.forEach((e) => {
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
    async getTransactionHistory(filters: {
      startingBlock: number;
      order?: 'asc' | 'desc';
    }) {
      const transactions: Transaction[] = [];
      for (const connection of providerConnection) {
        const {
          ProviderConnectorImpl,
        } = require(`../impl/${connection.provider.id}/index`);
        const service = new ProviderConnectorImpl(connection);
        const res = (await service.getTransactionHistory(
          filters
        )) as Transaction[];
        res.forEach((e) => {
          transactions.push(e);
        });
      }
      switch (filters.order) {
        case 'asc':
          transactions.sort((a, b) => a.timestamp - b.timestamp);
          break;
        case 'desc':
          transactions.sort((a, b) => b.timestamp - a.timestamp);
        default:
          break;
      }
      return transactions;
    },
    async getCurrenciesPricesInUSDC(
      assets: Assets[],
      startDate: number,
      endDate: number
    ) {
      const prices: Prices = [];
      //staff this function to return the prices of the currencies in USDC
      for (const asset of assets) {
        if (asset === 'usdt' || asset === 'dai') {
          continue;
        }
        const price = await getAssetPriceInUSDC(asset, startDate, endDate);
        prices.push({
          asset,
          close: price.close,
          volume: price.volume,
          high: price.high,
          date: parseInt(price.date),
          low: price.low,
        });
      }
      return prices;
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
  return url;
  //staff this function to return the base url
};
const setProdUrl = (provider: Providers) => {
  switch (provider) {
    case 'binance':
      return 'https://api.binance.com';
    case 'etherscan':
      return 'https://api.etherscan.io/api';
    case 'polygonscan':
      return 'https://api.polygonscan.com/api';
    case 'snowtrace':
      return 'https://snowtrace.io/api';
    case 'circle':
      return 'https://api.circle.com/v1';
    default:
      return 'https://api.etherscan.io/api';
  }
};
const setTestUrl = (provider: Providers) => {
  switch (provider) {
    case 'binance':
      return 'https://testnet.binance.vision';
    case 'etherscan':
      return 'https://api-goerli.etherscan.io/api';
    case 'polygonscan':
      return 'https://api-testnet.polygonscan.com/api';
    case 'snowtrace':
      return 'https://api-testnet.snowtrace.io/api';
    case 'circle':
      return 'https://api-sandbox.circle.com/v1';
    default:
      return 'https://api-goerli.etherscan.io/api';
  }
};
const getTestnetByMainnet = (chain: Chains) => {
  switch (chain) {
    case 'eth':
      return 'goerli';
    case 'avax':
      return 'fuji';
    case 'polygon':
      return 'mumbai';
    default:
      return 'goerli';
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
const convertToken = (value: string, decimals: number) => {
  const web3 = new Web3(Web3.givenProvider || 'ws://localhost:8545');
  return web3.utils
    .toBN(value)
    .div(web3.utils.toBN(10 ** decimals))
    .toString();
};
const getAssetPriceInUSDC = async (
  asset: Assets,
  startDate: number,
  endDate: number
) => {
  //staff this function to return the price of the asset in USDC
  try {
    const { data } = await axios.get(
      `https://poloniex.com/public?command=returnChartData&currencyPair=USDC_${asset.toUpperCase()}&start=${startDate}&end=${endDate}&period=14400`
    );
    return data[0] as PoloniexPrice;
  } catch (error) {
    throw new Error();
  }
};
const getAssetDataByChain = (
  contract: {
    token: 'USDT' | 'DAI' | 'USDC';
    networks: {
      chain: Chains;
      address: string;
      decimalPosition: number;
    }[];
  },
  chain: Chains,
  provider: {
    id: Providers;
    useTestnet: boolean;
    auth: {
      apiKey?: string;
      apiSecret?: string;
    };
  }
) => {
  const filteredContract = contract.networks.find(
    (e) =>
      e.chain ===
      (provider.useTestnet
        ? getTestnetByMainnet(chain as Chains)
        : chain === 'eth'
        ? 'erc20'
        : chain)
  );
  return filteredContract as {
    chain: Chains;
    address: string;
    decimalPosition: number;
  };
};

export {
  setClient,
  getDescription,
  manageBaseUrl,
  getSupportedContracts,
  weiToEth,
  convertToken,
  getAssetPriceInUSDC,
  getTestnetByMainnet,
  getAssetDataByChain,
};
