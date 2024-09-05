import twilio from "../../twilio.app.mjs";
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
      delete result._version;
      this.$emit(result, meta);
    },
  },
  async run() {
    const dateCreatedAfter = this._getCreatedAfter();
    let newDateCreatedAfter = dateCreatedAfter;

    const results = await this.listResults({
      dateCreatedAfter,
    });

    for (const result of results) {
      const dateCreated = result.dateCreated;
      const ts = Date.parse(dateCreated);
      if ( !dateCreatedAfter || ts > Date.parse(dateCreatedAfter) ) {
        this.emitEvent(result);
        if (!dateCreatedAfter || ts > Date.parse(newDateCreatedAfter)) {
          newDateCreatedAfter = dateCreated;
        }
      }
    }
    this._setCreatedAfter(newDateCreatedAfter);
  },
};
