import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import salesmsg from "../../salesmsg.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "salesmsg-contact-created",
  name: "New Contact Created",
  version: "0.0.1",
  description: "Emit new event when a new contact is created.",
  type: "source",
  dedupe: "unique",
  props: {
    salesmsg,
    db: "$.service.db",
    timer: {
      label: "Polling interval",
      description: "Pipedream will poll the Salesmsg API on this schedule",
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
    async startEvent(maxResults = 0) {

      const lastDate = this._getLastDate();
      const items = this.salesmsg.paginate({
        fn: this.salesmsg.listContacts,
        maxResults,
        perPage: true,
        params: {
          "sortBy": "created_at",
          "sortOrder": "desc",
          "filtersList[0][filters][0][key]": "created_at",
          "filtersList[0][filters][0][operator]": "is_after",
          "filtersList[0][filters][0][value]": lastDate,
          "filtersList[1][filters][0][key]": "created_at",
          "filtersList[1][filters][0][operator]": "is_equal_to",
          "filtersList[1][filters][0][value]": lastDate,
        },
      });

      let responseArray = [];

      for await (const item of items) {
        responseArray.push(item);
      }

      if (responseArray.length) this._setLastDate(responseArray[0].created_at);

      for (const item of responseArray.reverse()) {
        this.$emit(
          item,
          {
            id: item.id,
            summary: `A new contact with id: "${item.id}" was created!`,
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
  sampleEmit,
};
