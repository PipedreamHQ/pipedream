import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import moment from "moment";
import unbounce from "../../unbounce.app.mjs";

export default {
  key: "unbounce-form-submission-received",
  name: "New Form Submission Received",
  version: "0.0.1",
  description: "Emit new event when a new form submit is received.",
  type: "source",
  dedupe: "unique",
  props: {
    unbounce,
    db: "$.service.db",
    timer: {
      label: "Polling interval",
      description: "Pipedream will poll the Unbounce on this schedule",
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    pageId: {
      propDefinition: [
        unbounce,
        "pageId",
      ],
    },
  },
  methods: {
    _getLastDate() {
      return this.db.get("lastDate") || 0;
    },
    _setLastDate(lastDate) {
      this.db.set("lastDate", lastDate);
    },
    async startEvent(maxResults) {
      const {
        unbounce,
        pageId,
      } = this;

      const lastDate = this._getLastDate();
      let responseArray = [];

      const items = unbounce.paginate({
        fn: unbounce.listPageLeads,
        params: {
          sort_order: "desc",
          from: lastDate,
        },
        pageId,
        maxResults,
      });

      for await (const item of items) {
        if (moment(item.created_at).isSame(lastDate)) {
          break;
        }
        responseArray.push(item);
      }

      if (responseArray[0]) {
        this._setLastDate(responseArray[0].created_at);
      }

      for (const responseItem of responseArray.reverse()) {
        this.$emit(
          responseItem,
          {
            id: responseItem.id,
            summary: `A new form submission with id: "${responseItem.id}" was received!`,
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
