## Biz account connectors

## Get Started

```javascript
import Connector from '@bloom-trade/connector';

const credentials = {
  credentials: {
    client_id: '',
    client_secret: '',
  },
  realmId: '',
  refresh_token: '',
};
const connector = new Connector();
const client = connector.getClient(credentials, 'quickbooks');
client?.getInvoice('99').then((invoices) => {
  //your invoice
  console.log(invoices.products);
});
```
