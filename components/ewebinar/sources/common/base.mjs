import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import ewebinar from "../../ewebinar.app.mjs";

export default {
  props: {
    ewebinar,
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
      return this.db.get("lastDate") || null;
    },
    _setLastDate(lastDate) {
      this.db.set("lastDate", lastDate);
    },
    async startEvent(maxResults = false) {
      let lastDate = this._getLastDate();
      const response = this.ewebinar.paginate({
        fn: this.ewebinar.listRegistrantSessions,
      });
      const responseArray = [];
      for await (const item of response) {
        responseArray.push(item);
      }

      let sortedRegistrants = responseArray
        .sort((a, b) => Date.parse(b.registeredTime) - Date.parse(a.registeredTime));

      if (maxResults && (sortedRegistrants.length >= maxResults))
        sortedRegistrants.length = maxResults;

      if (lastDate) sortedRegistrants = sortedRegistrants.filter(
        (registrant) => Date.parse(registrant.registeredTime) > Date.parse(lastDate),
      );

      sortedRegistrants = this.filterArray(sortedRegistrants);

      if (sortedRegistrants.length) this._setLastDate(sortedRegistrants[0].registeredTime);

      for (const registrant of sortedRegistrants.reverse()) {
        this.$emit(registrant, {
          id: registrant.id,
          summary: this.getSummary(registrant),
          ts: registrant.registeredTime,
        });
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
