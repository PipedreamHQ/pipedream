import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import agentset from "../../agentset.app.mjs";
import { prepareDateTime } from "../../common/utils.mjs";

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
    statuses: {
      propDefinition: [
        agentset,
        "statuses",
      ],
      optional: true,
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
          statuses: this.statuses,
          orderBy: "createdAt",
          order: "desc",
          pageSize: 100,
          maxResults,
        },
      });

      let responseArray = [];
      for await (const item of response) {
        const dateTime = prepareDateTime(item);
        if (Date.parse(dateTime) <= lastData) break;
        responseArray.push(item);
      }

      if (responseArray.length) {
        this._setLastData(Date.parse(responseArray[0].createdAt));
      }

      for (const item of responseArray.reverse()) {
        const dateTime = prepareDateTime(item);
        this.$emit(item, {
          id: `${item.id}-${item.status}`,
          summary: this.getSummary(item),
          ts: Date.parse(dateTime),
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
