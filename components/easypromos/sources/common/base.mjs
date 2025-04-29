import {
  ConfigurationError, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import easypromos from "../../easypromos.app.mjs";

export default {
  props: {
    easypromos,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    info: {
      type: "alert",
      alertType: "info",
      content: "The Easypromos API only works with \"White Label\" promotions, any other type will not appear in the list.",
    },
    promotionId: {
      propDefinition: [
        easypromos,
        "promotionId",
      ],
    },
  },
  methods: {
    _getLastId() {
      return this.db.get("lastId") || 0;
    },
    _setLastId(lastId) {
      this.db.set("lastId", lastId);
    },
    getOpts() {
      return {};
    },
    async emitEvent(maxResults = false) {
      const lastId = this._getLastId();
      let responseArray = [];

      try {
        const response = this.easypromos.paginate({
          fn: this.getFunction(),
          ...this.getOpts(),
          params: {
            order: "created_desc",
          },
        });

        for await (const item of response) {
          if (item.id <= lastId) break;
          responseArray.push(item);
        }
      } catch (err) {
        console.log(err);
        if (err?.response?.data?.code === 0) {
          throw new ConfigurationError("You can only use this trigger with promotions that have the 'Virtual Coins' feature enabled.");
        }
        throw new ConfigurationError(err);
      }

      if (responseArray.length) {
        if (maxResults && (responseArray.length > maxResults)) {
          responseArray.length = maxResults;
        }
        this._setLastId(responseArray[0].id);
      }

      for (const item of responseArray.reverse()) {
        this.$emit(item, {
          id: item.id || item.transaction.id,
          summary: this.getSummary(item),
          ts: Date.parse(item.created || new Date()),
        });
      }
    },
  },
  hooks: {
    async deploy() {
      await this.emitEvent(25);
    },
  },
  async run() {
    await this.emitEvent();
  },
};
