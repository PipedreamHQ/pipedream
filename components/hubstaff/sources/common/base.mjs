import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import hubstaff from "../../hubstaff.app.mjs";

export default {
  props: {
    hubstaff,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    organizationId: {
      propDefinition: [
        hubstaff,
        "organizationId",
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
    getParams() {
      return {};
    },
    async emitEvent(maxResults = false) {
      const lastId = this._getLastId();

      const response = this.hubstaff.paginate({
        fn: this.getFunction(),
        model: this.getModel(),
        params: this.getParams(),
        organizationId: this.organizationId,
      });

      let responseArray = [];
      for await (const item of response) {
        if (item.id > lastId) {
          responseArray.push(item);
        }
      }

      responseArray.reverse();

      if (responseArray.length) {
        if (maxResults && (responseArray.length > maxResults)) {
          responseArray.length = maxResults;
        }
        this._setLastId(responseArray[0].id);
      }

      for (const item of responseArray.reverse()) {
        this.$emit(item, {
          id: item.id,
          summary: this.getSummary(item),
          ts: Date.parse(item.created_at),
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
