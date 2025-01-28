import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import swapcardExhibitor from "../../swapcard_exhibitor.app.mjs";

export default {
  props: {
    swapcardExhibitor,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    eventId: {
      propDefinition: [
        swapcardExhibitor,
        "eventId",
      ],
    },
  },
  methods: {
    _getLastDate() {
      return this.db.get("lastDate") || "1970-01-01T00:00:00Z";
    },
    _setLastDate(lastDate) {
      this.db.set("lastDate", lastDate);
    },
    async emitEvent(maxResults = false) {
      const lastDate = this._getLastDate();

      const response = this.swapcardExhibitor.paginate({
        fn: this.getFunction(),
        maxResults,
        eventId: this.eventId,
        type: this.getType(),
        filters: this.getFilters(lastDate),
        sort: {
          field: "REGISTERED_AT",
          order: "DESC",
        },
      });

      let responseArray = [];
      for await (const item of response) {
        responseArray.push(item);
      }

      if (responseArray.length) {
        this._setLastDate(this.getDate(responseArray[0]));
      }

      for (const item of responseArray.reverse()) {
        this.$emit(item, {
          id: item.id,
          summary: this.getSummary(item),
          ts: Date.parse(this.getDate(item)),
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
