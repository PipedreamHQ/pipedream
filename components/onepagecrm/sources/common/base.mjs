import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import onepagecrm from "../../onepagecrm.app.mjs";

export default {
  props: {
    onepagecrm,
    db: "$.service.db",
    timer: {
      label: "Polling interval",
      description: "Pipedream will poll the OnePageCRM on this schedule",
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getLastDate() {
      return this.db.get("lastDate");
    },
    _setLastDate(lastDate = null) {
      this.db.set("lastDate", lastDate);
    },
    async startEvent(maxResults = 0) {
      const lastDate = this._getLastDate();
      const field = this.getField();
      const filterField = this.getFilterField();

      const response = this.onepagecrm.paginate({
        fn: this.getFunction(),
        field: `${field}s`,
        maxResults,
        params: this.getParams(lastDate),
      });

      const responseArray = [];

      for await (const item of response) {
        if (Date.parse(item[field][filterField]) < lastDate) break;
        responseArray.push(item[field]);
      }

      if (responseArray.length) this._setLastDate(Date.parse(responseArray[0].created_at));

      for (const item of responseArray.reverse()) {
        this.$emit(
          item,
          {
            id: item.id,
            summary: this.getSummary(item),
            ts: item.created_at,
          },
        );
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
};
