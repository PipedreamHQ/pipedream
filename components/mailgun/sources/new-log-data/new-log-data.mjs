import common from "../common/timer-based.mjs";

export default {
  ...common,
  key: "mailgun-new-log-data",
  name: "New Log Data",
  type: "source",
  description: "Emit new event when new data is logged in Mailgun's Control Panel. Occurs for most actions within the associated Mailgun account.",
  version: "0.0.2",
  dedupe: "unique",
  methods: {
    ...common.methods,
    _getLastSeenTime() {
      return this.db.get("lastSeenTime");
    },
    _setLastSeenTime(lastSeenTime) {
      this.db.set("lastSeenTime", lastSeenTime);
    },
    generateMeta(payload) {
      return {
        id: payload.id,
        summary: `[${payload["log-level"]}] ${payload.event}`,
        ts: payload.timestamp,
      };
    },
    async getLatestEvents(page = null, limit = 300, ascending = "yes") {
      const date = new Date();
      if (ascending === "yes") {
        date.setDate(date.getDate() - 1);
      } else {
        date.setDate(date.getDate());
      }
      const config = {
        begin: Math.floor(date.valueOf() / 1000),
        ascending,
        limit,
      };
      if (page) {
        config.page = page;
      }
      return this.mailgun.api("events").get(this.domain, config);
    },
  },
  hooks: {
    async deploy() {
      // Emit sample events on the first run during deploy
      let lastSeenTime = this._getLastSeenTime();
      const { items } = await this.getLatestEvents(null, 5, "no");
      if (items.length === 0) {
        return;
      }
      for (let item of items) {
        if (item.timestamp <= lastSeenTime) {
          continue;
        }
        this._setLastSeenTime(item.timestamp);
        this.$emit(item, this.generateMeta(item));
      }
    },
  },
  async run() {
    let result = {
      items: [],
      pages: {
        next: {
          id: null,
        },
      },
    };
    while (true) {
      result = await this.getLatestEvents(result.pages.next.number, 300);
      if (result.items.length === 0) {
        return;
      }
      const lastSeenTime = this._getLastSeenTime();
      for (let item of result.items) {
        if (item.timestamp <= lastSeenTime) {
          continue;
        }
        this._setLastSeenTime(item.timestamp);
        this.$emit(item, this.generateMeta(item));
      }
    }
  },
};
