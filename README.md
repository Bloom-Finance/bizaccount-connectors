## Biz account connectors

Is a package entended to be used with multiple web3 and web2 providers to interact with blockchains.

## Get Started

```javascript
import Connector from '@bloom-trade/bizaccount-connector';

const credentials = [
  {
    addresses: ['0xF274800E82717D38d2e2ffe18A4C6489a50C5Add'],
    chain: 'eth',
    provider: {
      id: 'etherscan',
      useTestnet: true,
      auth: {
        apiKey: 'YOUR API KEY',
      },
    },
  },
];
const connector = new Connector();
const client = connector.getClient(credentials);
client.getBalance().then((balance) => {
  //your balance
  console.log(balance);
});
```
