import ewebinar from "../../ewebinar.app.mjs";
import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";

export default {
  key: "ewebinar-attendee-converted",
  name: "Attendee Visited Conversion Page",
  description: "Emits a new event when an attendee visits a conversion pixel positioned page, typically post a purchase.",
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
    async getConvertedAttendees(nextCursor) {
      const response = await this.ewebinar.getRegistrantSessions({
        nextCursor,
      });
      const registrants = response.items; // Assuming the response contains an items array
      return registrants.filter((registrant) => registrant.converted);
    },
    getNextCursor() {
      return this.db.get("nextCursor") || null;
    },
    setNextCursor(nextCursor) {
      this.db.set("nextCursor", nextCursor);
    },
  },
  hooks: {
    async deploy() {
      // Fetch historical data and emit up to the last 50 converted attendees
      let nextCursor = null;
      let hasMore = true;
      let emittedCount = 0;

      while (hasMore && emittedCount < 50) {
        const convertedAttendees = await this.getConvertedAttendees(nextCursor);
        for (const attendee of convertedAttendees) {
          this.$emit(attendee, {
            id: attendee.id,
            summary: `Attendee ${attendee.name} converted`,
            ts: attendee.timestamp, // Assuming the response contains a timestamp field
          });
          emittedCount++;
          if (emittedCount >= 50) break;
        }
        nextCursor = response.nextCursor; // Assuming the response contains a nextCursor field
        hasMore = !!nextCursor;
      }

      this.setNextCursor(nextCursor);
    },
  },
  async run() {
    // Fetch new converted attendees and emit events
    const nextCursor = this.getNextCursor();
    const convertedAttendees = await this.getConvertedAttendees(nextCursor);

    for (const attendee of convertedAttendees) {
      this.$emit(attendee, {
        id: attendee.id,
        summary: `Attendee ${attendee.name} converted`,
        ts: attendee.timestamp, // Assuming the response contains a timestamp field
      });
    }

    this.setNextCursor(convertedAttendees.nextCursor); // Assuming the response contains a nextCursor field
  },
};
