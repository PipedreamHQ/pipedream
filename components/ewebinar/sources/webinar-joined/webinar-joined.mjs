import ewebinar from "../../ewebinar.app.mjs";
import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";

export default {
  key: "ewebinar-webinar-joined",
  name: "Webinar Joined",
  description: "Emits an event immediately after a registrant joins a webinar session or starts a replay. [See the documentation](https://api.ewebinar.com/v2)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    ewebinar,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    nextCursor: {
      propDefinition: [
        ewebinar,
        "nextCursor",
      ],
    },
  },
  methods: {
    _getCursor() {
      return this.db.get("nextCursor") || null;
    },
    _setCursor(value) {
      this.db.set("nextCursor", value);
    },
  },
  hooks: {
    async deploy() {
      // Fetch historical data when component is deployed
      let nextCursor = this._getCursor();
      let hasMore = true;

      while (hasMore) {
        const response = await this.ewebinar.getRegistrantSessions({
          nextCursor,
        });
        hasMore = response.hasMore;
        nextCursor = response.nextCursor;
        for (const registrant of response.items) {
          this.$emit(registrant, {
            id: registrant.id,
            summary: `Registrant ${registrant.name} joined webinar`,
            ts: Date.parse(registrant.joinedAt),
          });
        }
      }

      // Save the last cursor for the next polling
      this._setCursor(nextCursor);
    },
  },
  async run() {
    // Fetch new data based on the last saved cursor
    const nextCursor = this._getCursor();
    const response = await this.ewebinar.getRegistrantSessions({
      nextCursor,
    });

    if (response.items && response.items.length > 0) {
      for (const registrant of response.items) {
        this.$emit(registrant, {
          id: registrant.id,
          summary: `Registrant ${registrant.name} joined webinar`,
          ts: Date.parse(registrant.joinedAt),
        });
      }
    }

    // Update the cursor based on the response
    this._setCursor(response.nextCursor);
  },
};
