import base from "../common/base-polling.mjs";
import constants from "../common/constants.mjs";

export default {
  ...base,
  key: "square-new-booking-created",
  name: "New Booking Created",
  description: "Emit new event for every new booking created. [See the docs](https://developer.squareup.com/reference/square/bookings-api/list-bookings)",
  type: "source",
  version: "0.0.3",
  dedupe: "unique",
  hooks: {
    ...base.hooks,
    async deploy() {
      console.log(`Retrieving at most last ${constants.MAX_HISTORICAL_EVENTS} objects...`);
      const { bookings } = await this.square.listBookings({
        params: {
          ...this.getBaseParams(),
        },
      });
      if (!(bookings?.length > 0)) {
        return;
      }
      this._setLastTs(Date.parse(bookings[bookings.length - 1].created_at));
      bookings?.slice(-constants.MAX_HISTORICAL_EVENTS)
        .forEach((booking) => this.$emit(booking, this.generateMeta(booking)));
    },
  },
  methods: {
    ...base.methods,
    getBaseParams() {
      return {
        limit: constants.MAX_LIMIT,
      };
    },
    generateMeta(booking) {
      return {
        id: booking.id,
        summary: `Booking created: ${booking.id}`,
        ts: Date.parse(booking.created_at),
      };
    },
  },
  async run() {
    const lastTs = this._getLastTs();
    let newLastTs;
    let cursor;

    do {
      const response = await this.square.listBookings({
        params: {
          ...this.getBaseParams(),
          cursor,
        },
      });
      const { bookings } = response;
      if (!(bookings?.length > 0)) {
        break;
      }
      newLastTs = Date.parse(bookings[bookings.length - 1].created_at);
      for (const booking of bookings) {
        if (Date.parse(booking.created_at) > lastTs) {
          this.emitEvent(booking);
        }
      }
      cursor = response?.cursor;
    } while (cursor);

    this._setLastTs(newLastTs);
  },
};
