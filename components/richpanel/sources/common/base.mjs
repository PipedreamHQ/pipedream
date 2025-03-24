import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import { camelToSnakeCase } from "../../common/utils.mjs";
import richpanel from "../../richpanel.app.mjs";

export default {
  props: {
    richpanel,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getLastDate() {
      return this.db.get("lastDate") || "1970-01-01";
    },
    _setLastDate(lastDate) {
      this.db.set("lastDate", lastDate);
    },
    async prepareData(data) {
      const response = [];
      for await (const item of data) {
        response.push(item);
      }
      return response;
    },
    getParams() {
      return {};
    },
    async emitEvent(maxResults = false) {
      const lastDate = this._getLastDate();
      const dateField = this.getDateField();

      const response = this.richpanel.paginate({
        fn: this.richpanel.listTickets,
        maxResults,
        params: {
          ...this.getParams(),
          startDate: lastDate,
          sortKey: dateField,
          sortOrder: "DESC",
        },
      });

      let responseArray = await this.prepareData(response, lastDate);

      if (responseArray.length) {
        this._setLastDate(responseArray[0][camelToSnakeCase(dateField)]);
      }

      for (const item of responseArray.reverse()) {
        const dateVal = item[camelToSnakeCase(dateField)];
        this.$emit(item, {
          id: `${item.id}-${dateVal}`,
          summary: this.getSummary(item),
          ts: Date.parse(dateVal),
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
