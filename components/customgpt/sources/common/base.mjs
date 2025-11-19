import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import customgpt from "../../customgpt.app.mjs";

export default {
  props: {
    customgpt,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    projectId: {
      propDefinition: [
        customgpt,
        "projectId",
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
    getOtherOpts() {
      return {};
    },
    getFieldData() {
      return null;
    },
    async emitEvent(maxResults = false) {
      const lastId = this._getLastId();
      const fn = this.getFunction();
      const response = this.customgpt.paginate({
        fn,
        projectId: this.projectId,
        fieldData: this.getFieldData(),
        ...this.getOtherOpts(),
        params: {
          orderBy: "id",
          order: "desc",
        },
      });

      let responseArray = [];
      for await (const item of response) {
        if (item.id <= lastId) break;
        responseArray.push(item);
      }

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
