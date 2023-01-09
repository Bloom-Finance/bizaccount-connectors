export const contracts = {
  tokens: [
    {
      token: 'USDT',
      networks: [
        {
          chain: 'goerli',
          address: '0x509Ee0d083DdF8AC028f2a56731412edD63223B9',
          decimalPosition: 18,
        },
        {
          chain: 'erc20',
          address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
          decimalPosition: 18,
        },
      ],
    },
    {
      token: 'DAI',
      networks: [
        {
          chain: 'goerli',
          address: '0x11fE4B6AE13d2a6055C8D9cF65c55bac32B5d844',
          decimalPosition: 18,
        },
        {
          chain: 'erc20',
          address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
          decimalPosition: 18,
        },
      ],
    },
    {
      token: 'USDC',
      networks: [
        {
          chain: 'goerli',
          address: '0x07865c6E87B9F70255377e024ace6630C1Eaa37F',
          decimalPosition: 6,
        },
        {
          chain: 'erc20',
          address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          decimalPosition: 6,
        },
      ],
    },
  ],
};
