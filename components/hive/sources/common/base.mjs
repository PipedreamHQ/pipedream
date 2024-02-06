import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import moment from "moment";
import hive from "../../hive.app.mjs";

export default {
  type: "source",
  dedupe: "unique",
  props: {
    hive,
    db: "$.service.db",
    timer: {
      label: "Polling interval",
      description: "Pipedream will poll the Hive on this schedule",
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    workspaceId: {
      propDefinition: [
        hive,
        "workspaceId",
      ],
      optional: true,
    },
  },
  methods: {
    _getLastDate() {
      return this.db.get("lastDate") || moment().unix();
    },
    _setLastDate(lastDate) {
      this.db.set("lastDate", lastDate);
    },
    async startEvent(maxResults = 0) {
      const {
        hive,
        workspaceId,
      } = this;

      const field = this.getField();

      const lastDate = this._getLastDate();
      const fn = this.getFunction(hive);
      let items = await fn({
        workspaceId,
        params: {
          sortBy: `${field} desc`,
        },
      });

      items = items.filter((item) => moment(item[field]).isAfter(lastDate));
      if (maxResults) items = items.slice(0, maxResults);
      if (items.length) this._setLastDate(items[items.length - 1][field]);

      for (const item of items.reverse()) {
        this.$emit(
          item,
          {
            id: `${item.id}${item[field]}`,
            summary: this.getSummary(item.id),
            ts: Date.parse(item[field]),
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
