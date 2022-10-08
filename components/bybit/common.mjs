export const SIDE = [
  "Buy",
  "Sell",
];

export const ORDER_TYPE = [
  "Limit",
  "Market",
];

export const STOP_ORDER_TYPE = [
  "TakeProfit",
  "StopLoss",
  "TrailingStop",
  "Stop",
];

export const TP_SL_MODE = [
  "Full",
  "Partial",
];

export const CURRENCY = [
  "BTC",
  "ETH",
  "EOS",
  "XRP",
  "DOT",
  "USDT",
];

export const CONTRACT_TYPE = [
  "InversePerpetual",
  "LinearPerpetual",
  "InverseFutures",
];

export const CONTRACT_STATUS = [
  "Trading",
  "Settling",
  "Closed",
];

export const WALLET_FUND_TYPE = [
  "Deposit",
  "Withdraw",
  "RealisedPNL",
  "Commission",
  "Refund",
  "Prize",
  "ExchangeOrderWithdraw",
  "ExchangeOrderDeposit",
  "ReturnServiceCash",
  "Insurance",
  "SubMember",
  "Coupon",
  "AccountTransfer",
  "CashBack",
];

export const TIME_IN_FORCE = [
  "GoodTillCancel",
  "ImmediateOrCancel",
  "FillOrKill",
  "PostOnly",
];

export const TRIGGER_PRICE_TYPE = [
  "LastPrice",
  "IndexPrice",
  "MarkPrice",
];

export const KLINE_DESC_MAPPING = {
  "1min": "1",
  "3min": "3",
  "5min": "5",
  "15min": "15",
  "30min": "30",
  "1h": "60",
  "2h": "120",
  "4h": "240",
  "6h": "360",
  "12h": "720",
  "1D": "D",
  "1W": "W",
  "1M": "M",
};

export const TICK_DIRECTION = [
  "PlusTick",
  "ZeroPlusTick",
  "MinusTick",
  "ZeroMinusTick",
];
