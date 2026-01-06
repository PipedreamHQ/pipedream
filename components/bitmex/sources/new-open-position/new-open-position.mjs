import bitmex from "../../bitmex.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "bitmex-new-open-position",
  name: "New Open Position",
  description: "Emit new event when a new open position is detected on your BitMEX account. [See the documentation](https://www.bitmex.com/api/explorer/#!/Position/Position_get)",
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
    accountId: {
      type: "integer",
      label: "Account ID",
      description: "Account ID to filter positions",
    },
    symbol: {
      type: "string",
      label: "Symbol",
      description: "Instrument symbol. Send a bare series (e.g. XBT) to get data for the nearest expiring contract in that series. You can also send a timeframe, e.g. `XBT:quarterly`. Timeframes are `nearest`, `daily`, `weekly`, `monthly`, `quarterly`, `biquarterly`, and `perpetual`. Symbols are case-insensitive.",
      optional: true,
    },
    currency: {
      type: "string",
      label: "Currency",
      description: "Currency to filter positions",
      optional: true,
    },
  },
  methods: {
    _getEmittedPositionKeys() {
      return new Set(this.db.get("emittedPositionKeys") || []);
    },
    _setEmittedPositionKeys(positionKeys) {
      this.db.set("emittedPositionKeys", Array.from(positionKeys));
    },
    _getPositionKey(position) {
      return `${position.account || ""}_${position.symbol || ""}_${position.currency || ""}`;
    },
  },
  hooks: {
    async deploy() {
      const filter = {
        account: this.accountId,
      };
      if (this.symbol) {
        filter.symbol = this.symbol;
      }
      if (this.currency) {
        filter.currency = this.currency;
      }

      const positions = await this.bitmex.getPositions({
        filter: JSON.stringify(filter),
        count: 100,
      });

      const emittedPositionKeys = new Set();
      for (const position of positions) {
        if (position.isOpen) {
          const key = this._getPositionKey(position);
          emittedPositionKeys.add(key);
          this.$emit(position, {
            id: key,
            summary: `Open position: ${position.symbol} ${position.currentQty || 0}`,
            ts: position.timestamp
              ? new Date(position.timestamp).getTime()
              : Date.now(),
          });
        }
      }
      this._setEmittedPositionKeys(emittedPositionKeys);
    },
  },
  async run() {
    const emittedPositionKeys = this._getEmittedPositionKeys();

    const filter = {
      account: this.accountId,
    };
    if (this.symbol) {
      filter.symbol = this.symbol;
    }
    if (this.currency) {
      filter.currency = this.currency;
    }

    const positions = await this.bitmex.getPositions({
      filter: JSON.stringify(filter),
      count: 100,
    });

    const newPositions = [];
    for (const position of positions) {
      if (!position.isOpen) {
        continue;
      }

      const key = this._getPositionKey(position);
      if (!emittedPositionKeys.has(key)) {
        newPositions.push(position);
        emittedPositionKeys.add(key);
      }
    }

    for (const position of newPositions) {
      this.$emit(position, {
        id: this._getPositionKey(position),
        summary: `New open position: ${position.symbol} ${position.currentQty || 0}`,
        ts: position.timestamp
          ? new Date(position.timestamp).getTime()
          : Date.now(),
      });
    }

    // Keep only recent position keys (last 500)
    const positionKeysArray = Array.from(emittedPositionKeys);
    if (positionKeysArray.length > 500) {
      this._setEmittedPositionKeys(new Set(positionKeysArray.slice(-500)));
    } else {
      this._setEmittedPositionKeys(emittedPositionKeys);
    }
  },
};

