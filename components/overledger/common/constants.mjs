export const TECHNOLOGY_OPTIONS = [
  {
    label: "Ethereum",
    value: "ethereum",
  },
  {
    label: "Substrate",
    value: "substrate",
  },
  {
    label: "XRP Ledger",
    value: "xrp ledger",
  },
  {
    label: "Bitcoin",
    value: "bitcoin",
  },
  {
    label: "Hyperledger Fabric",
    value: "hyperledger fabric",
  },
];

export const NETWORK_OPTIONS = {
  "ethereum": [
    "ethereum sepolia testnet",
    "ethereum mainnet",
    "polygon amoy testnet",
    "polygon mainnet",
    "avalanche fuji testnet",
    "avalanche c-chain mainnet",
    "xdc apothem testnet",
    "xdc network mainnet",
  ],
  "substrate": [
    "polkadot westend",
    "polkadot mainnet",
  ],
  "xrp ledger": [
    "testnet",
    "mainnet",
  ],
  "bitcoin": [
    "testnet",
    "mainnet",
  ],
  "hyperledger fabric": [
    "Sandbox",
  ],
};
//Overledger environment to be used - Test or Live
export const OVERLEDGER_INSTANCE = [
  {
    label: "Sandbox",
    value: "sandbox",
  },
  {
    label: "Overledger",
    value: "overledger",
  },
];
///unit options to allow for the correct selection based on the location network
export const UNIT_OPTIONS = {
  "ethereum": "ETH",               // Ethereum's token symbol is ETH
  "substrate": "DOT",              // Polkadot's token symbol is DOT
  "xrp ledger": "XRP",             // XRP Ledger's token symbol is XRP
  "bitcoin": "BTC",                // Bitcoin's token symbol is BTC
  "hyperledger fabric": "FAB",     // Placeholder for Hyperledger Fabric's token symbol
};
