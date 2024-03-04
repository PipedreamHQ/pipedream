import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import reviewflowz from "../../reviewflowz.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "reviewflowz-new-review",
  name: "New Review",
  description: "Emit new event when a review is published on any of your listings.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    reviewflowz,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    accountId: {
      propDefinition: [
        reviewflowz,
        "accountId",
      ],
    },
  },
  methods: {
    _getLastDate() {
      return this.db.get("lastDate") || "01-01-1970";
    },
    _setLastDate(createdAt) {
      this.db.set("lastDate", createdAt);
    },
    generateMeta(review) {
      const ts = Date.parse(review.date);
      return {
        id: ts,
        summary: `New review published at: ${review.profile}`,
        ts: ts,
      };
    },
    getParams() {
      return {};
    },
    async startEvent(maxResults = 0) {
      const lastDate = this._getLastDate();

      const data = this.reviewflowz.paginate({
        fn: this.reviewflowz.listReviews,
        accountId: this.accountId,
        params: {
          start_date: lastDate,
        },
        maxResults,
      });

      const responseArray = [];
      for await (const item of data) {
        if (Date.parse(item.date) <= Date.parse(lastDate)) break;
        responseArray.push(item);
      }

      if (responseArray.length) this._setLastDate(responseArray[0].date);

      for (const item of responseArray.reverse()) {
        this.$emit(item, this.generateMeta(item));
      }
    },
  },
  hooks: {
    async deploy() {
      await this.startEvent(25);
    },
  },
  async run() {
    await this.startEvent();
  },
  sampleEmit,
};
