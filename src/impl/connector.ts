import { ProviderCredentials } from '../@types';
import { manageBaseUrl } from '../utils';
import { Chains } from '../@types/index';
export class ProviderConnector {
  protected _credentials: any;
  protected chain: Chains | undefined;
  protected addresses: string[] | undefined;
  protected _baseurl = '';
  constructor(connection: ProviderCredentials) {
    this._credentials = connection.provider.auth;
    if (connection.addresses && connection.addresses.length > 0) {
      this.addresses = connection.addresses;
    }
    this.chain = connection.chain;
    this._baseurl = manageBaseUrl(connection);
  }
}
