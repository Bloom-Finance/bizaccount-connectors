import {
  Client,
  ConnectorConfig,
  IConnector,
  ProviderCredentials,
} from '../@types';
import { Providers } from '../@types/index';
import { setClient } from '../utils';
class Connector implements IConnector {
  getClient<T extends Providers>(
    credentials: ProviderCredentials<T>,
    providerType: T,
    config?: ConnectorConfig
  ): Client<
    T extends 'binance' ? 'binance' : T extends 'stripe' ? 'stripe' : 'metamask'
  > {
    return setClient(credentials, providerType, config);
  }
}

export default Connector;
