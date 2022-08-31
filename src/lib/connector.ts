import { Client, IConnector, ProviderCredentials } from '../@types';
import { Providers } from '../@types/index';
import { setClient } from '../utils';
class Connector implements IConnector {
  getClient(providerConnection: ProviderCredentials[]): Client {
    return setClient(providerConnection);
  }
}

export default Connector;
