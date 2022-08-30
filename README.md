## Biz account connectors

## Get Started

```javascript
import Connector from '@bloom-trade/bizaccount-connector';

const credentials = {
  {
    apiKey: 'YOUR_API_KEY',
    apiSecret:
      'YOUR_API_SECRET',
  },
  'binance',
  {
    useTestnet: true,
  }
};
const connector = new Connector();
const client = connector.getClient(credentials, 'binance',{useTestnet:true});
client.getBalance().then((invoices) => {
  //your balance
  console.log(invoices.products);
});
```
