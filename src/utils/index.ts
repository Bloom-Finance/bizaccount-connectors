/* eslint-disable @typescript-eslint/no-var-requires */
import { ConnectorConfig, Providers } from '../@types/index';
import fs from 'fs';

const setClient = <T extends Providers>(
  credentials: any,
  providerType: T,
  config?: ConnectorConfig
) => {
  return {
    provider: providerType,
    credentials,
    getBalance: async () => {
      // call impl
      const {
        ProviderConnectorImpl,
      } = require(`../impl/${providerType}/index`);
      const service = new ProviderConnectorImpl(credentials, config);
      const balance = await service.getBalance();
      return Promise.resolve(balance);
    },
  } as any;
};
const getDescription = (asset: string) => {
  const obj = require('../cryptocurrencies.json');
  const myKeys = Object.keys(obj);
  const foundKey = myKeys.find((e) => e === asset);
  if (!foundKey) return '';
  return obj[foundKey];
};
export { setClient, getDescription };
