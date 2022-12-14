import { ProviderConnector } from '../connector';
import {
  IProviderConnector,
  Balance,
  Transaction,
  Chains,
} from '../../@types/index';
import axios from 'axios';
import {
  convertToken,
  getAssetDataByChain,
  getAssetPriceInUSDC,
  getDescription,
  getSupportedContracts,
  weiToEth,
} from '../../utils';
import Web3 from 'web3';
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
            e.detail.find((e) => e.address === address) &&
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
        const web3 = new Web3(Web3.givenProvider || 'ws://localhost:8545');
        balance.push({
          asset: 'ETH',
          description: 'Ethereum',
          balance: web3.utils.fromWei(data.result, 'ether'),
          detail: [
            {
              address,
              provider: this._provider.id,
              chain: this.chain as string,
              balance: web3.utils.fromWei(data.result, 'ether'),
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
              getAssetDataByChain(
                contract,
                this.chain as Chains,
                this._provider
              ).address
            }&address=${address}&tag=latest&apikey=${apiKey}`
          );
          if (data.result !== '0') {
            let retrievedBalance;
            if (
              getAssetDataByChain(
                contract,
                this.chain as Chains,
                this._provider
              ).decimalPosition === 18
            ) {
              retrievedBalance = weiToEth(data.result);
            } else {
              retrievedBalance = convertToken(
                data.result,
                getAssetDataByChain(
                  contract,
                  this.chain as Chains,
                  this._provider
                ).decimalPosition
              );
            }
            balance.push({
              asset: contract.token,
              description: getDescription(contract.token),
              balance: retrievedBalance,
              detail: [
                {
                  address,
                  provider: this._provider.id,
                  chain: this.chain as string,
                  balance: retrievedBalance,
                },
              ],
            });
          }
        }
        continue;
      }
    }
    return balance as any;
    //staff
  }
  async getTransactionHistory(filters: { startingBlock: number }) {
    const apiKey = this._credentials.apiKey;
    const contracts = getSupportedContracts();
    if (!this.addresses) {
      return [] as any;
    }
    const transactions: Transaction[] = [];
    for (const address of this.addresses) {
      const {
        data: { result: ethTransactions },
      } = await axios.get(
        `${this._baseurl}?module=account&action=txlist&address=${address}&startblock=${filters.startingBlock}&endblock=99999999&page=1&offset=10
        &tag=latest&apikey=${apiKey}`
      );
      for (const e of ethTransactions) {
        if (e.value !== '0') {
          const lowerCaseAddress = address.toLowerCase();
          const lowerCaseFrom = e.from.toLowerCase();
          const { close } = await getAssetPriceInUSDC(
            'eth',
            e.timeStamp,
            e.timeStamp
          );
          const obj = {
            asset: 'ETH',
            from: e.from,
            to: e.to,
            amount: weiToEth(e.value),
            status: (lowerCaseAddress != lowerCaseFrom ? 'in' : 'out') as any,
            timestamp: parseInt(e.timeStamp),
            provider: this._provider.id,
            chain: this.chain as any,
            block: e.blockNumber,
            amountInUSDC: (
              parseFloat(close) * parseFloat(weiToEth(e.value))
            ).toString(),
          };
          if (lowerCaseAddress == lowerCaseFrom) {
            Object.assign(obj, {
              gas: e.gas,
              gasPrice: e.gasPrice,
              gasUsed: e.gasUsed,
            });
          }
          transactions.push(obj);
        }
      }
      for (const contract of contracts) {
        const {
          data: { result: ERC20Transactions },
        } = await axios.get(
          `${this._baseurl}?module=account&action=tokentx&contractaddress=${
            contract.networks.find((e) => e.chain === this.chain)?.address
          }&address=${address}&startblock=0&endblock=99999999&page=1&offset=10
          &tag=latest&apikey=${apiKey}`
        );
        for (const e of ERC20Transactions) {
          if (e.value !== '0') {
            const lowerCaseAddress = address.toLowerCase();
            const lowerCaseFrom = e.from.toLowerCase();
            const obj = {
              asset: contract.token,
              from: e.from,
              to: e.to,
              amount: convertToken(e.value, 18),
              status:
                lowerCaseAddress !== lowerCaseFrom ? 'in' : ('out' as any),
              timestamp: parseInt(e.timeStamp),
              provider: this._provider.id,
              chain: this.chain as any,
              block: e.blockNumber,
            };
            if (lowerCaseAddress === lowerCaseFrom) {
              Object.assign(obj, {
                gas: e.gas,
                gasPrice: e.gasPrice,
                gasUsed: e.gasUsed,
              });
            }
            transactions.push(obj);
          }
        }
      }
    }
    return transactions;
  }
}
