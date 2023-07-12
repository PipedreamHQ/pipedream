import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import moment from "moment";
import clientify from "../../clientify.app.mjs";

export default {
  dedupe: "unique",
  props: {
    clientify,
    db: "$.service.db",
    timer: {
      label: "Polling interval",
      description: "Pipedream will poll the Clientify on this schedule",
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
    _setLastDate(lastDate) {
      this.db.set("lastDate", lastDate);
    },
    async startEvent(maxResults) {
      const lastDate = this._getLastDate() || moment("1970-01-01");

      const items = this.clientify.paginate({
        fn: this.getFunction(),
        params: this.getParams(lastDate),
        maxResults,
      });

      for await (const responseItem of items) {
        this._setLastDate(moment(responseItem.created).format("YYYY-MM-DD"));
        this.$emit(
          responseItem,
          {
            id: responseItem.id,
            summary: this.getSummary(responseItem),
            ts: responseItem.created,
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
