import base from "../common/base.mjs";
import constants from "../common/constants.mjs";

export default {
  ...base,
  key: "square-new-booking-created",
  name: "New Booking Created",
  description: "Emit new event for every new booking created",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  hooks: {
    ...base.hooks,
    async deploy() {
      console.log(`Retrieving at most last ${constants.MAX_HISTORICAL_EVENTS} objects...`);
      const response = await this.square.listBookings({
        paginate: true,
        params: {
          limit: constants.MAX_LIMIT,
        },
      });
      response?.objects?.slice(-constants.MAX_HISTORICAL_EVENTS)
        .reverse()
        .forEach((object) => this.$emit(object, {
          id: object.id,
          summary: `Booking created: ${object.id}`,
          ts: object.created_at,
        }));
    },
  },
  methods: {
    ...base.methods,
    getEventTypes() {
      return [
        "booking.created",
      ];
    },
    getSummary(event) {
      return `Booking created: ${event.data.id}`;
    },
    getTimestamp(event) {
      return new Date(event.data.object.booking_created.created_at);
    },
  },
};
