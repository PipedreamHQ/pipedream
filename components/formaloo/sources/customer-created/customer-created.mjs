import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import moment from "moment";
import formaloo from "../../formaloo.app.mjs";

export default {
  key: "formaloo-customer-created",
  name: "New Customer Created",
  version: "0.0.1",
  description: "Emit new event when a new customer is created.",
  type: "source",
  dedupe: "unique",
  props: {
    formaloo,
    db: "$.service.db",
    timer: {
      label: "Polling interval",
      description: "Pipedream will poll the Formaloo on this schedule",
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

      const items = this.formaloo.paginate({
        object: "customers",
        fn: this.formaloo.listCustomers,
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

      if (responseArray.length) {
        this._setLastDate(responseArray[0].created_at);
      }

      for (const responseItem of responseArray.reverse()) {
        this.$emit(
          responseItem,
          {
            id: responseItem.code,
            summary: `A customer with code: "${responseItem.code}" was created!`,
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
