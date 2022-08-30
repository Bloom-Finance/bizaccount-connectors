import { ConnectorConfig, ProviderCredentials } from '../@types';
export class ProviderConnector {
  protected _credentials: any;
  protected _baseurl = '';
  constructor(creds: ProviderCredentials<any>, config: ConnectorConfig) {
    this._credentials = creds;
    if (config.useTestnet) {
      this._baseurl = 'https://testnet.binance.vision';
    } else {
      this._baseurl = 'https://api1.binance.com';
    }
  }
}
