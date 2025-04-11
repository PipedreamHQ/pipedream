import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import agentset from "../../agentset.app.mjs";

export default {
  props: {
    agentset,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    namespaceId: {
      propDefinition: [
        agentset,
        "namespaceId",
      ],
    },
  },
  methods: {
    _getLastData() {
      return this.db.get("lastData") || 0;
    },
    _setLastData(lastData) {
      this.db.set("lastData", lastData);
    },
    async emitEvent(maxResults = false) {
      const lastData = this._getLastData();

      const response = this.agentset.paginate({
        fn: this.getFunction(),
        namespaceId: this.namespaceId,
        params: {
          orderBy: "createdAt",
          order: "desc",
          pageSize: 100,
          maxResults,
        },
      });

      let responseArray = [];
      for await (const item of response) {
        if (Date.parse(item.createdAt) <= lastData) break;
        responseArray.push(item);
      }

      if (responseArray.length) {
        this._setLastData(Date.parse(responseArray[0].createdAt));
      }

      for (const item of responseArray.reverse()) {
        this.$emit(item, {
          id: `${item.id}`,
          summary: this.getSummary(item),
          ts: Date.parse(item.createdAt),
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
