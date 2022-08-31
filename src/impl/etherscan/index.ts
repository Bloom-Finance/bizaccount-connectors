import { ProviderConnector } from '../connector';
import { IProviderConnector, Balance } from '../../@types/index';
import axios from 'axios';
import { getDescription, getSupportedContracts } from '../../utils';
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
    const balance: Balance = [];
    const contracts = getSupportedContracts();
    if (!this.addresses) {
      return [] as any;
    }
    for (const address of this.addresses) {
      if (
        !balance.find((e) => {
          if (
            !e.detail.find((e) => e.address === address) &&
            e.asset === 'ETH'
          ) {
            return e;
          }
        })
      ) {
        const { data } = await axios.get(
          `${this._baseurl}?module=account&action=balance&address=${address}&tag=latest&apikey=${apiKey}`
        );
        //TODO: Wei convertion
        balance.push({
          asset: 'ETH',
          description: 'Ethereum',
          balance: data.result,
          detail: [
            {
              address,
              provider: this._provider.id,
              chain: this.chain as string,
              balance: data.result,
            },
          ],
        });
      }
      for (const contract of contracts) {
        if (!balance.find((e) => e.asset === contract.token)) {
          const { data } = await axios.get(
            `${
              this._baseurl
            }?module=account&action=tokenbalance&contractaddress=${
              contract.networks.find((e) => e.chain === this.chain)?.address
            }&address=${address}&tag=latest&apikey=${apiKey}`
          );
          if (data.result !== '0') {
            balance.push({
              asset: contract.token,
              description: getDescription(contract.token),
              balance: data.result,
              detail: [
                {
                  address,
                  provider: this._provider.id,
                  chain: this.chain as string,
                  balance: data.result,
                },
              ],
            });
          }
        }
        continue;
      }
    }
    console.log(balance);
    return [{}] as any;
    //staff
  }
}
