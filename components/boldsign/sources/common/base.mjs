import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import boldsign from "../../boldsign.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  props: {
    boldsign,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    sentBy: {
      propDefinition: [
        boldsign,
        "sentBy",
      ],
      optional: true,
    },
    recipients: {
      type: "string[]",
      label: "Recipients",
      description: "Recipients of the document.",
      optional: true,
    },
    searchKey: {
      type: "string",
      label: "Search Key",
      description: "Search key for documents.",
      optional: true,
    },
    labels: {
      propDefinition: [
        boldsign,
        "labels",
      ],
      optional: true,
    },
    brandIds: {
      propDefinition: [
        boldsign,
        "brandId",
      ],
      type: "string[]",
      label: "Brand IDs",
      description: "Brand IDs associated with the document.",
      optional: true,
    },
  },
  methods: {
    _getLastDate() {
      return this.db.get("lastDate") || 0;
    },
    _setLastDate(lastDate) {
      this.db.set("lastDate", lastDate);
    },
    async emitEvent(maxResults = false) {
      const lastDate = this._getLastDate();
      const params = {
        ...this.getParams(),
      };

      if (this.sentBy) params.sentBy = this.sentBy;
      if (this.recipients) params.recipients = parseObject(this.recipients);
      if (this.searchKey) params.searchKey = this.searchKey;
      if (this.labels) params.labels = parseObject(this.labels);
      if (this.brandIds) params.brandIds = parseObject(this.brandIds);

      const response = this.boldsign.paginate({
        fn: this.getFunction(),
        params,
      });

      let responseArray = [];
      for await (const item of response) {
        if (item.activityDate <= lastDate) break;
        responseArray.push(item);
      }

      if (responseArray.length) {
        if (maxResults && (responseArray.length > maxResults)) {
          responseArray.length = maxResults;
        }
        this._setLastDate(responseArray[0].activityDate);
      }

      for (const item of responseArray.reverse()) {
        this.$emit(item, {
          id: item.documentId,
          summary: this.getSummary(item),
          ts: Date.parse(item.activityDate || new Date()),
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
