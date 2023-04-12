const WS_URL = "wss://ws.blockchain.info/mercury-gateway/v1/ws";
const BASE_URL = "https://api.blockchain.com";
const VERSION_PATH = "/v3/exchange";
const DEFAULT_MAX = 600;

const ACTION = {
  SUBSCRIBE: "subscribe",
  UNSUBSCRIBE: "unsubscribe",
};

const EVENT = {
  REJECTED: "rejected",
  SUBSCRIBED: "subscribed",
  UNSUBSCRIBED: "unsubscribed",
  SNAPSHOT: "snapshot",
  UPDATED: "updated",
};

const CHANNEL = {
  HEARTBEAT: "heartbeat",
  L2: "l2",
  L3: "l3",
  PRICES: "prices",
  SYMBOLS: "symbols",
  TICKER: "ticker",
  AUTH: "auth",
  BALANCES: "balances",
  TRADING: "trading",
};

const TIME_IN_FORCE = {
  GTC: {
    value: "GTC",
    label: "Good Till Cancelled",
  },
  IOC: {
    value: "IOC",
    label: "Immediate or Cancel",
  },
  FOK: {
    value: "FOK",
    label: "Fill or Kill",
  },
  GTD: {
    value: "GTD",
    label: "Good Till Dat",
  },
};

const ORDER_TYPE = {
  LIMIT: "limit",
  MARKET: "market",
  STOP: "stop",
  STOPLIMIT: "stopLimit",
};

const timeInForce = {
  type: "string",
  label: "Time In Force",
  description: "The time in force for the order. [See the docs](https://exchange.blockchain.com/api/#timeinforce).",
  options: Object.values(TIME_IN_FORCE),
  optional: true,
};

const minQty = {
  type: "string",
  label: "Minimum Quantity",
  description: "The minimum quantity of the order.",
  optional: true,
};

const expireDate = {
  type: "string",
  label: "Expire Date",
  description: "The date the order will expire.",
  optional: true,
};

const price = {
  type: "string",
  label: "Price",
  description: "The price of the order.",
};

const stopPx = {
  type: "string",
  label: "Stop Price",
  description: "The stop price of the order.",
};

// Table reference in https://exchange.blockchain.com/api/#trading
const FIELD = {
  [ORDER_TYPE.MARKET]: {
    timeInForce,
    minQty,
  },
  [ORDER_TYPE.LIMIT]: {
    timeInForce: {
      ...timeInForce,
      optional: false,
    },
    expireDate,
    minQty,
    price,
  },
  [ORDER_TYPE.STOP]: {
    timeInForce: {
      ...timeInForce,
      optional: false,
    },
    stopPx,
  },
  [ORDER_TYPE.STOPLIMIT]: {
    timeInForce: {
      ...timeInForce,
      optional: false,
    },
    price,
    stopPx,
  },
};

const ORDER_STATE = {
  PENDING: "pending",
  OPEN: "open",
  REJECTED: "rejected",
  CANCELLED: "cancelled",
  FILLED: "filled",
  PARTIAL: "partial",
  EXPIRED: "expired",
};

const ORDER_SIDES = [
  "buy",
  "sell",
];

const TRADING_ACTION = {
  NEW_ORDER_SINGLE: "NewOrderSingle",
  CANCEL_ORDER_REQUEST: "CancelOrderRequest",
  ORDER_MASS_CANCEL_REQUEST: "OrderMassCancelRequest",
  ORDER_MASS_STATUS_REQUEST: "OrderMassStatusRequest",
};

export default {
  WS_URL,
  BASE_URL,
  VERSION_PATH,
  DEFAULT_MAX,
  ACTION,
  EVENT,
  CHANNEL,
  TIME_IN_FORCE,
  FIELD,
  ORDER_STATE,
  ORDER_TYPE,
  ORDER_SIDES,
  TRADING_ACTION,
};
