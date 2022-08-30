/* eslint-disable @typescript-eslint/no-var-requires */
import { ConnectorConfig, Providers } from '../@types/index';
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

export { setClient };
