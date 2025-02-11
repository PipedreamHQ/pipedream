import polygon from "../../polygon.app.mjs";

export default {
  key: "polygon-new-stock-trade",
  name: "New Stock Trade",
  description: "Emit new event when a trade occurs for a specified stock ticker. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    polygon: {
      type: "app",
      app: "polygon",
    },
    db: {
      type: "$.service.db",
    },
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
    stockTicker: {
      propDefinition: [
        "polygon",
        "stockTicker",
      ],
    },
  },
  hooks: {
    async deploy() {
      const trades = await this.polygon.getTradeEvents();
      if (!trades || !trades.events) {
        return;
      }
      const sortedTrades = trades.events.sort((a, b) => b.q - a.q).slice(0, 50)
        .reverse();
      for (const trade of sortedTrades) {
        this.$emit(trade, {
          id: trade.q,
          summary: `New trade for ${trade.sym} at $${trade.p}`,
          ts: trade.t,
        });
      }
      if (sortedTrades.length > 0) {
        const lastTrade = sortedTrades[sortedTrades.length - 1];
        await this.db.set("lastTradeSeq", lastTrade.q);
      }
    },
    async activate() {
      // No specific activation logic required
    },
    async deactivate() {
      // No specific deactivation logic required
    },
  },
  async run() {
    const lastTradeSeq = await this.db.get("lastTradeSeq") || 0;
    const trades = await this.polygon.getTradeEvents();
    if (!trades || !trades.events) {
      return;
    }
    const newTrades = trades.events.filter((trade) => trade.q > lastTradeSeq);
    newTrades.sort((a, b) => a.q - b.q);
    for (const trade of newTrades) {
      this.$emit(trade, {
        id: trade.q,
        summary: `New trade for ${trade.sym} at $${trade.p}`,
        ts: trade.t,
      });
    }
    if (newTrades.length > 0) {
      const latestTrade = newTrades[newTrades.length - 1];
      await this.db.set("lastTradeSeq", latestTrade.q);
    }
  },
};
