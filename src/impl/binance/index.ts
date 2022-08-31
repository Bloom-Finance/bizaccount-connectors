import { ProviderConnector } from '../connector';
import { IProviderConnector } from '../../@types/index';
import { Spot } from '@binance/connector';
import { getDescription } from '../../utils';
export class ProviderConnectorImpl
  extends ProviderConnector
  implements IProviderConnector
{
  async getBalance(): Promise<
    {
      asset: string;
      balance: string;
      description: string;
      detail: {
        address: string;
        provider: string;
        chain: string;
        balance: string;
      }[];
    }[]
  > {
    const apiKey = this._credentials.apiKey;
    const apiSecret = this._credentials.apiSecret;
    const client = new Spot(apiKey, apiSecret, {
      baseURL: this._baseurl,
    });
    const res = await client.account();
    const balance: any[] = [];
    const myBalances = res.data.balances;
    const indexes = Object.keys(myBalances);
    //add details to balance
    indexes.forEach((i) => {
      balance.push({
        asset: myBalances[i].asset,
        description: getDescription(myBalances[i].asset),
        balance: myBalances[i].free,
        detail: [{ balance: myBalances[i].free, provider: this._provider.id }],
      });
    });
    return balance;
  }
  // async getBalance(): Promise<{ asset: string; balance: string }[]> {

  // }
}
