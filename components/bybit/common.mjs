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

export const CONTRACT_TYPE = [
  "InversePerpetual",
  "LinearPerpetual",
  "InverseFutures",
];

export const CATEGORY_TYPE = [
  "linear",
  "inverse",
  "option",
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
  "1 minute": "1",
  "3 minutes": "3",
  "5 minutes": "5",
  "15 minutes": "15",
  "30 minutes": "30",
  "1 hour": "60",
  "2 hours": "120",
  "4 hours": "240",
  "6 hours": "360",
  "12 hours": "720",
  "1 Day": "D",
  "1 Week": "W",
  "1 Month": "M",
};

export const TICK_DIRECTION = [
  "PlusTick",
  "ZeroPlusTick",
  "MinusTick",
  "ZeroMinusTick",
];
