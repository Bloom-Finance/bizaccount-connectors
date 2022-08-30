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
    getBalance() {
      const balance: Balance = [];
      providerConnection.forEach((connection) => {
        const {
          ProviderConnectorImpl,
        } = require(`../impl/${connection.provider.id}/index`);
        const service = new ProviderConnectorImpl(connection);
      });
      throw new Error('Method not implemented.');
      //staff
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
  return '';
  //staff this function to return the base url
};
export { setClient, getDescription, manageBaseUrl };
