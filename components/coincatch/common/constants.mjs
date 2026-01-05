const PRODUCT_TYPES = [
  {
    value: "UMCBL",
    label: "USDT perpetual contract",
  },
  {
    value: "DMCBL",
    label: "Universal margin perpetual contract",
  },
];

const GRANULARITIES = [
  {
    value: "1m",
    label: "1 minute",
  },
  {
    value: "3m",
    label: "3 minutes",
  },
  {
    value: "5m",
    label: "5 minutes",
  },
  {
    value: "15m",
    label: "15 minutes",
  },
  {
    value: "30m",
    label: "30 minutes",
  },
  {
    value: "1H",
    label: "1 hour",
  },
  {
    value: "2H",
    label: "2 hours",
  },
  {
    value: "4H",
    label: "4 hours",
  },
  {
    value: "6H",
    label: "6 hours",
  },
  {
    value: "12H",
    label: "12 hours",
  },
  {
    value: "1D",
    label: "1 day",
  },
  {
    value: "3D",
    label: "3 days",
  },
  {
    value: "1W",
    label: "1 week",
  },
  {
    value: "1M",
    label: "1 month",
  },
  {
    value: "6Hutc",
    label: "6 hours UTC",
  },
  {
    value: "12Hutc",
    label: "12 hours UTC",
  },
  {
    value: "1Dutc",
    label: "1 day UTC",
  },
  {
    value: "3Dutc",
    label: "3 days UTC",
  },
  {
    value: "1Wutc",
    label: "1 week UTC",
  },
  {
    value: "1Mutc",
    label: "1 month UTC",
  },
];

const MARKET_DEPTH_LIMITS = [
  5,
  15,
  50,
  100,
];

export default {
  PRODUCT_TYPES,
  GRANULARITIES,
  MARKET_DEPTH_LIMITS,
};
