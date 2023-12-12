import twilio from "../twilio.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    twilio,
    db: "$.service.db",
    timer: {
      label: "Polling schedule",
      description: "Pipedream polls Twilio for events on this schedule.",
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getCreatedAfter() {
      return this.db.get("createdAfter");
    },
    _setCreatedAfter(createdAfter) {
      this.db.set("createdAfter", createdAfter);
    },
    emitEvent(result) {
      const meta = this.generateMeta(result);
      this.$emit(result, meta);
    },
  },
  async run() {
    let dateCreatedAfter = this._getCreatedAfter();
    const params = {
      dateCreatedAfter,
    };
    const results = await this.listResults(params);
    for (const result of results) {
      this.emitEvent(result);
      if (
        !dateCreatedAfter ||
        Date.parse(result.dateCreated) > Date.parse(dateCreatedAfter)
      )
        dateCreatedAfter = result.dateCreated;
    }
    this._setCreatedAfter(dateCreatedAfter);
  },
};
