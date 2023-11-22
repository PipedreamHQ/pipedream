import ewebinar from "../../ewebinar.app.mjs";
import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";

export default {
  key: "ewebinar-new-registration",
  name: "New Registration",
  description: "Emits an event when a registrant submits a completed registration form.",
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
      ...ewebinar.propDefinitions.nextCursor,
      optional: true,
    },
  },
  methods: {
    _getLatestCursor() {
      return this.db.get("nextCursor") || null;
    },
    _setLatestCursor(nextCursor) {
      this.db.set("nextCursor", nextCursor);
    },
  },
  hooks: {
    async deploy() {
      // Fetch historical data and emit up to 50 most recent items
      let nextCursor = null;
      let hasMore = true;
      let emittedCount = 0;
      const maxEmitCount = 50;

      while (hasMore && emittedCount < maxEmitCount) {
        const response = await this.ewebinar.getRegistrantSessions({
          nextCursor,
        });
        const {
          registrants, pagination,
        } = response;

        if (registrants.length === 0) {
          hasMore = false;
          continue;
        }

        for (const registrant of registrants) {
          this.$emit(registrant, {
            id: registrant.id,
            summary: `New Registration: ${registrant.name}`,
            ts: Date.parse(registrant.created_at),
          });
          emittedCount++;
          if (emittedCount >= maxEmitCount) {
            break;
          }
        }

        nextCursor = pagination.nextCursor;
        hasMore = !!nextCursor;
      }

      this._setLatestCursor(nextCursor);
    },
  },
  async run() {
    let nextCursor = this._getLatestCursor();

    const response = await this.ewebinar.getRegistrantSessions({
      nextCursor,
    });
    const {
      registrants, pagination,
    } = response;

    for (const registrant of registrants) {
      this.$emit(registrant, {
        id: registrant.id,
        summary: `New Registration: ${registrant.name}`,
        ts: Date.parse(registrant.created_at),
      });
    }

    this._setLatestCursor(pagination.nextCursor);
  },
};
