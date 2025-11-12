import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import moment from "moment";
import daffy from "../../daffy.app.mjs";

export default {
  key: "daffy-new-donation-created",
  name: "New Donation Created",
  version: "0.0.2",
  description: "Emit new event when a donation is created.",
  type: "source",
  dedupe: "unique",
  props: {
    daffy,
    db: "$.service.db",
    timer: {
      label: "Polling interval",
      description: "Pipedream will poll the Daffy on this schedule",
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
      let responseArray = [];

      const items = this.daffy.paginate({
        fn: this.daffy.listDonations,
        maxResults,
      });

      let count = 0;

      for await (const item of items) {
        responseArray.push(item);

        if (maxResults && ++count === maxResults) {
          break;
        }
      }

      responseArray = responseArray.filter((item) => moment(item.created_at).isAfter(lastDate));
      responseArray = responseArray.sort(
        (a, b) => moment.utc(b.created_at).diff(moment.utc(a.created_at)),
      );

      if (responseArray.length) {
        this._setLastDate(responseArray[0].created_at);
      }

      for (const responseItem of responseArray.reverse()) {
        this.$emit(
          responseItem,
          {
            id: responseItem.id,
            summary: `A donation with Id: "${responseItem.id}" was created!`,
            ts: responseItem.created_at,
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
