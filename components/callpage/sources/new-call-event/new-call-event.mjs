import callpage from "../../callpage.app.mjs";
import { CALL_STATUSES } from "../../common/constants.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "callpage-new-call-event",
  name: "New Call Event",
  description: "Emit new event when there is a new call event.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    callpage,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
    callStatuses: {
      type: "string[]",
      label: "Call Statuses",
      description: "Select the call statuses to trigger events for",
      options: CALL_STATUSES,
    },
  },
  methods: {
    _getLastDate() {
      return this.db.get("lastDate") || [];
    },
    _setLastDate(lastDate) {
      return this.db.set("lastDate", lastDate);
    },
    async startEvent(maxResults = false) {
      const lastDate = this._getLastDate();
      const response = this.callpage.paginate({
        fn: this.callpage.listEvents,
        maxResults,
        params: {
          date_from: lastDate,
          statuses: this.callStatuses,
        },
      });

      const responseArray = [];

      for await (const item of response) {
        responseArray.push(item);
      }

      if (responseArray.length) {
        this._setLastDate(Date.parse(responseArray[responseArray.length - 1].created_at));
      }

      for (const event of responseArray) {
        this.$emit(event, {
          id: event.id,
          summary: `New call event with ID: ${event.human_status}`,
          ts: Date.parse(event.created_at),
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
  sampleEmit,
};
