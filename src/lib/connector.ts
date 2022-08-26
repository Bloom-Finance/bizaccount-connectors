import { Client, IConnector } from '../@types';

class Connector implements IConnector {
  getClient(): Client {
    throw new Error('Method not implemented.');
  }
}

export default Connector;
