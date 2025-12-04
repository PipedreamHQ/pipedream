const DEFAULT_LIMIT = 1000;

const REQUIRED_FIELDS_FOR_ORDER_TYPES = {
  MARKET: {
    instrument: true,
    units: true,
    timeInForce: true,
    positionFill: true,
    priceBound: false,
  },
  LIMIT: {
    instrument: true,
    units: true,
    price: true,
    timeInForce: true,
    positionFill: true,
    triggerCondition: true,
    gtdTime: false,
  },
  STOP: {
    instrument: true,
    units: true,
    price: true,
    timeInForce: true,
    positionFill: true,
    triggerCondition: true,
    gtdTime: false,
  },
  MARKET_IF_TOUCHED: {
    instrument: true,
    units: true,
    price: true,
    timeInForce: true,
    positionFill: true,
    triggerCondition: true,
    priceBound: false,
    gtdTime: false,
  },
  TAKE_PROFIT: {
    tradeID: true,
    price: true,
    timeInForce: true,
    triggerCondition: true,
    gtdTime: false,
  },
  STOP_LOSS: {
    tradeID: true,
    price: true,
    timeInForce: true,
    triggerCondition: true,
    distance: false,
    gtdTime: false,
  },
  GUARANTEED_STOP_LOSS: {
    tradeID: true,
    price: true,
    timeInForce: true,
    triggerCondition: true,
    distance: false,
    gtdTime: false,
  },
  TRAILING_STOP_LOSS: {
    tradeID: true,
    distance: true,
    timeInForce: true,
    triggerCondition: true,
    gtdTime: false,
  },
};

const TRADE_STATES = [
  {
    label: "The Trades that are currently open",
    value: "OPEN",
  },
  {
    label: "The Trades that have been fully closed",
    value: "CLOSED",
  },
  {
    label: "The Trades that will be closed as soon as the trades’ instrument becomes tradeable",
    value: "CLOSE_WHEN_TRADEABLE",
  },
  {
    label: "The Trades that are in any of the possible states listed above",
    value: "ALL",
  },
];

const CANDLE_GRANULARITIES = [
  {
    value: "S5",
    label: "5 second candlesticks, minute alignment",
  },
  {
    value: "S10",
    label: "10 second candlesticks, minute alignment",
  },
  {
    value: "S15",
    label: "15 second candlesticks, minute alignment",
  },
  {
    value: "S30",
    label: "30 second candlesticks, minute alignment",
  },
  {
    value: "M1",
    label: "1 minute candlesticks, minute alignment",
  },
  {
    value: "M2",
    label: "2 minute candlesticks, hour alignment",
  },
  {
    value: "M4",
    label: "4 minute candlesticks, hour alignment",
  },
  {
    value: "M5",
    label: "5 minute candlesticks, hour alignment",
  },
  {
    value: "M10",
    label: "10 minute candlesticks, hour alignment",
  },
  {
    value: "M15",
    label: "15 minute candlesticks, hour alignment",
  },
  {
    value: "M30",
    label: "30 minute candlesticks, hour alignment",
  },
  {
    value: "H1",
    label: "1 hour candlesticks, hour alignment",
  },
  {
    value: "H2",
    label: "2 hour candlesticks, day alignment",
  },
  {
    value: "H3",
    label: "3 hour candlesticks, day alignment",
  },
  {
    value: "H4",
    label: "4 hour candlesticks, day alignment",
  },
  {
    value: "H6",
    label: "6 hour candlesticks, day alignment",
  },
  {
    value: "H8",
    label: "8 hour candlesticks, day alignment",
  },
  {
    value: "H12",
    label: "12 hour candlesticks, day alignment",
  },
  {
    value: "D",
    label: "1 day candlesticks, day alignment",
  },
  {
    value: "W",
    label: "1 week candlesticks, aligned to start of week",
  },
  {
    value: "M",
    label: "1 month candlesticks, aligned to first day of the month",
  },
];

const WEEKLY_ALIGNMENT_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const ORDER_TYPES = [
  "MARKET",
  "LIMIT",
  "STOP",
  "MARKET_IF_TOUCHED",
  "TAKE_PROFIT",
  "STOP_LOSS",
  "GUARANTEED_STOP_LOSS",
  "TRAILING_STOP_LOSS",
];

const TIME_IN_FORCE_OPTIONS = [
  {
    value: "GTC",
    label: "The Order is \"Good until Cancelled\"",
  },
  {
    value: "GTD",
    label: "The Order is \"Good until Date\" and will be cancelled at the provided time",
  },
  {
    value: "GFD",
    label: "The Order is \"Good For Day\" and will be cancelled at 5pm New York time",
  },
  {
    value: "FOK",
    label: "The Order must be immediately \"Filled Or Killed\"",
  },
  {
    value: "IOC",
    label: "The Order must be \"Immediately partially filled Or Cancelled\"",
  },
];

const POSITION_FILL_OPTIONS = [
  {
    value: "OPEN_ONLY",
    label: "When the Order is filled, only allow Positions to be opened or extended",
  },
  {
    value: "REDUCE_FIRST",
    label: "When the Order is filled, always fully reduce an existing Position before opening a new Position",
  },
  {
    value: "REDUCE_ONLY",
    label: "When the Order is filled, only reduce an existing Position",
  },
  {
    value: "DEFAULT",
    label: "When the Order is filled, use REDUCE_FIRST behaviour for non-client hedging Accounts, and OPEN_ONLY behaviour for client hedging Accounts",
  },
];

const ORDER_TRIGGER_CONDITIONS = [
  {
    value: "DEFAULT",
    label: "Trigger an Order the \"natural\" way: compare its price to the ask for long Orders and bid for short Orders.",
  },
  {
    value: "INVERSE",
    label: "Trigger an Order the opposite of the \"natural\" way: compare its price the bid for long Orders and ask for short Orders.",
  },
  {
    value: "BID",
    label: "Trigger an Order by comparing its price to the bid regardless of whether it is long or short.",
  },
  {
    value: "ASK",
    label: "Trigger an Order by comparing its price to the ask regardless of whether it is long or short.",
  },
  {
    value: "MID",
    label: "Trigger an Order by comparing its price to the midpoint regardless of whether it is long or short.",
  },
];

const TRANSACTION_TYPES = [
  {
    value: "ORDER",
    label: "Order-related Transactions. These are the Transactions that create, cancel, fill or trigger Orders",
  },
  {
    value: "FUNDING",
    label: "Funding-related Transactions",
  },
  {
    value: "ADMIN",
    label: "Administrative Transactions",
  },
  {
    value: "CREATE",
    label: "Account Create Transaction",
  },
  {
    value: "CLOSE",
    label: "Account Close Transaction",
  },
  {
    value: "REOPEN",
    label: "Account Reopen Transaction",
  },
  {
    value: "CLIENT_CONFIGURE",
    label: "Client Configuration Transaction",
  },
  {
    value: "CLIENT_CONFIGURE_REJECT",
    label: "Client Configuration Reject Transaction",
  },
  {
    value: "TRANSFER_FUNDS",
    label: "Transfer Funds Transaction",
  },
  {
    value: "TRANSFER_FUNDS_REJECT",
    label: "Transfer Funds Reject Transaction",
  },
  {
    value: "MARKET_ORDER",
    label: "Market Order Transaction",
  },
  {
    value: "MARKET_ORDER_REJECT",
    label: "Market Order Reject Transaction",
  },
  {
    value: "LIMIT_ORDER",
    label: "Limit Order Transaction",
  },
  {
    value: "LIMIT_ORDER_REJECT",
    label: "Limit Order Reject Transaction",
  },
  {
    value: "STOP_ORDER",
    label: "Stop Order Transaction",
  },
  {
    value: "STOP_ORDER_REJECT",
    label: "Stop Order Reject Transaction",
  },
  {
    value: "MARKET_IF_TOUCHED_ORDER",
    label: "Market if Touched Order Transaction",
  },
  {
    value: "MARKET_IF_TOUCHED_ORDER_REJECT",
    label: "Market if Touched Order Reject Transaction",
  },
  {
    value: "TAKE_PROFIT_ORDER",
    label: "Take Profit Order Transaction",
  },
  {
    value: "TAKE_PROFIT_ORDER_REJECT",
    label: "Take Profit Order Reject Transaction",
  },
  {
    value: "STOP_LOSS_ORDER",
    label: "Stop Loss Order Transaction",
  },
  {
    value: "STOP_LOSS_ORDER_REJECT",
    label: "Stop Loss Order Reject Transaction",
  },
  {
    value: "GUARANTEED_STOP_LOSS_ORDER",
    label: "Guaranteed Stop Loss Order Transaction",
  },
  {
    value: "GUARANTEED_STOP_LOSS_ORDER_REJECT",
    label: "Guaranteed Stop Loss Order Reject Transaction",
  },
  {
    value: "TRAILING_STOP_LOSS_ORDER",
    label: "Trailing Stop Loss Order Transaction",
  },
  {
    value: "TRAILING_STOP_LOSS_ORDER_REJECT",
    label: "Trailing Stop Loss Order Reject Transaction",
  },
  {
    value: "ONE_CANCELS_ALL_ORDER",
    label: "One Cancels All Order Transaction",
  },
  {
    value: "ONE_CANCELS_ALL_ORDER_REJECT",
    label: "One Cancels All Order Reject Transaction",
  },
  {
    value: "ONE_CANCELS_ALL_ORDER_TRIGGERED",
    label: "One Cancels All Order Trigger Transaction",
  },
  {
    value: "ORDER_FILL",
    label: "Order Fill Transaction",
  },
  {
    value: "ORDER_CANCEL",
    label: "Order Cancel Transaction",
  },
  {
    value: "ORDER_CANCEL_REJECT",
    label: "Order Cancel Reject Transaction",
  },
  {
    value: "ORDER_CLIENT_EXTENSIONS_MODIFY",
    label: "Order Client Extensions Modify Transaction",
  },
  {
    value: "ORDER_CLIENT_EXTENSIONS_MODIFY_REJECT",
    label: "Order Client Extensions Modify Reject Transaction",
  },
  {
    value: "TRADE_CLIENT_EXTENSIONS_MODIFY",
    label: "Trade Client Extensions Modify Transaction",
  },
  {
    value: "TRADE_CLIENT_EXTENSIONS_MODIFY_REJECT",
    label: "Trade Client Extensions Modify Reject Transaction",
  },
  {
    value: "MARGIN_CALL_ENTER",
    label: "Margin Call Enter Transaction",
  },
  {
    value: "MARGIN_CALL_EXTEND",
    label: "Margin Call Extend Transaction",
  },
  {
    value: "MARGIN_CALL_EXIT",
    label: "Margin Call Exit Transaction",
  },
  {
    value: "DELAYED_TRADE_CLOSURE",
    label: "Delayed Trade Closure Transaction",
  },
  {
    value: "DAILY_FINANCING",
    label: "Daily Financing Transaction",
  },
  {
    value: "RESET_RESETTABLE_PL",
    label: "Reset Resettable PL Transaction",
  },
];

export default {
  DEFAULT_LIMIT,
  REQUIRED_FIELDS_FOR_ORDER_TYPES,
  TRADE_STATES,
  CANDLE_GRANULARITIES,
  WEEKLY_ALIGNMENT_DAYS,
  ORDER_TYPES,
  TIME_IN_FORCE_OPTIONS,
  POSITION_FILL_OPTIONS,
  ORDER_TRIGGER_CONDITIONS,
  TRANSACTION_TYPES,
};
