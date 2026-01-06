import bitmex from "../../bitmex.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "bitmex-new-executed-trade",
  name: "New Executed Trade",
  description: "Emit new event when a balance‑affecting execution (trade fill, settlement, realized PnL) occurs in your BitMEX account. [See the documentation](https://www.bitmex.com/api/explorer/#!/Execution/Execution_getTradeHistory)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    bitmex,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    targetAccountId: {
      type: "integer",
      label: "Target Account ID",
      description: "AccountId fetching the trade history, must be a paired account with main user",
    },
    symbol: {
      type: "string",
      label: "Symbol",
      description: "Instrument symbol. Send a bare series (e.g. XBT) to get data for the nearest expiring contract in that series. You can also send a timeframe, e.g. `XBT:quarterly`. Timeframes are `nearest`, `daily`, `weekly`, `monthly`, `quarterly`, `biquarterly`, and `perpetual`. Symbols are case-insensitive.",
      optional: true,
    },
  },
  methods: {
    _getLastTimestamp() {
      return this.db.get("lastTimestamp");
    },
    _setLastTimestamp(timestamp) {
      this.db.set("lastTimestamp", timestamp);
    },
    _getEmittedTradeIds() {
      return new Set(this.db.get("emittedTradeIds") || []);
    },
    _setEmittedTradeIds(tradeIds) {
      this.db.set("emittedTradeIds", Array.from(tradeIds));
    },
  },
  hooks: {
    async deploy() {
      const trades = await this.bitmex.getTradeHistory({
        targetAccountId: this.targetAccountId,
        symbol: this.symbol,
        count: 25,
        reverse: true,
      });

      const emittedTradeIds = new Set();
      for (const trade of trades.slice(0, 10)) {
        if (trade.execID) {
          emittedTradeIds.add(trade.execID);
          this.$emit(trade, {
            id: trade.execID,
            summary: `Executed trade: ${trade.symbol} ${trade.side || ""} ${trade.lastQty || 0} @ ${trade.lastPx || 0}`,
            ts: trade.timestamp
              ? new Date(trade.timestamp).getTime()
              : Date.now(),
          });
        }
      }
      this._setEmittedTradeIds(emittedTradeIds);
      if (trades.length > 0 && trades[0].timestamp) {
        this._setLastTimestamp(new Date(trades[0].timestamp).getTime());
      }
    },
  },
  async run() {
    const lastTimestamp = this._getLastTimestamp();
    const emittedTradeIds = this._getEmittedTradeIds();
    const now = Date.now();

    const trades = await this.bitmex.getTradeHistory({
      targetAccountId: this.targetAccountId,
      symbol: this.symbol,
      count: 100,
      reverse: true,
    });

    const newTrades = [];
    for (const trade of trades) {
      if (!trade.execID || emittedTradeIds.has(trade.execID)) {
        continue;
      }

      const tradeTimestamp = trade.timestamp
        ? new Date(trade.timestamp).getTime()
        : now;
      if (!lastTimestamp || tradeTimestamp > lastTimestamp) {
        newTrades.push(trade);
        emittedTradeIds.add(trade.execID);
      }
    }

    // Sort by timestamp ascending
    newTrades.sort((a, b) => {
      const tsA = a.timestamp
        ? new Date(a.timestamp).getTime()
        : 0;
      const tsB = b.timestamp
        ? new Date(b.timestamp).getTime()
        : 0;
      return tsA - tsB;
    });

    for (const trade of newTrades) {
      this.$emit(trade, {
        id: trade.execID,
        summary: `Executed trade: ${trade.symbol} ${trade.side || ""} ${trade.lastQty || 0} @ ${trade.lastPx || 0}`,
        ts: trade.timestamp
          ? new Date(trade.timestamp).getTime()
          : Date.now(),
      });
    }

    if (newTrades.length > 0) {
      const latestTimestamp = newTrades[newTrades.length - 1].timestamp
        ? new Date(newTrades[newTrades.length - 1].timestamp).getTime()
        : now;
      this._setLastTimestamp(latestTimestamp);
    }

    // Keep only recent trade IDs (last 1000)
    const tradeIdsArray = Array.from(emittedTradeIds);
    if (tradeIdsArray.length > 1000) {
      this._setEmittedTradeIds(new Set(tradeIdsArray.slice(-1000)));
    } else {
      this._setEmittedTradeIds(emittedTradeIds);
    }
  },
};

