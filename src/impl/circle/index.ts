import { ProviderConnector } from '../connector';
import { IProviderConnector } from '../../@types/index';
import axios, { AxiosError } from 'axios';

interface CircleBalance {
  available: Array<{ amount: string; currency: string }>;
  unsettled: Array<{ amount: string; currency: string }>;
}
interface CircleWallets {
  address: string;
  currency: string;
  chain: string;
}
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
    try {
      const balance: {
        asset: string;
        balance: string;
        description: string;
        detail: {
          address: string;
          provider: string;
          chain: string;
          balance: string;
        }[];
      }[] = [];
      const {
        data: { data: res },
      } = await axios.get<{ data: CircleBalance }>(
        `${this._baseurl}/balances`,
        {
          headers: {
            Authorization: `Bearer ${this._provider.auth.apiKey}`,
          },
        }
      );
      const {
        data: { data: wallets },
      } = await axios.get<{ data: CircleWallets[] }>(
        `${this._baseurl}/businessAccount/wallets/addresses/deposit`,
        {
          headers: {
            Authorization: `Bearer ${this._provider.auth.apiKey}`,
          },
        }
      );
      const processedWallets: {
        address: string;
        chain: string;
        balance: string;
        provider: string;
      }[] = [];
      wallets.forEach((wallet) => {
        processedWallets.push({
          address: wallet.address,
          chain: wallet.chain,
          balance:
            res.available.find((item) => item.currency === wallet.currency)
              ?.amount || '0',
          provider: 'circle',
        });
      });
      res.available.forEach((item) => {
        balance.push({
          asset: item.currency === 'USD' ? 'USDC' : item.currency,
          balance: item.amount,
          description: 'Available balance',
          detail: processedWallets,
        });
      });
      return balance;
    } catch (error) {
      if (!(error instanceof AxiosError)) throw new Error('Unknown error');
      const axiosError = error as AxiosError<{ code: number; message: string }>;
      const { response } = axiosError;
      throw new Error(response?.data.message || 'Unknown error');
    }
  }
}
