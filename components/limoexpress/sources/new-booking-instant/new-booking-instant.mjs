import limoexpress from "../../limoexpress.app.mjs";
import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";

export default {
  key: "limoexpress-new-booking-instant",
  name: "New Limo Booking Created",
  description: "Emit new event when a customer creates a new limo booking. [See the documentation](https://api.limoexpress.me/api/docs/v1)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    limoexpress,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getLastBookingTime() {
      return this.db.get("lastBookingTime");
    },
    _setLastBookingTime(time) {
      this.db.set("lastBookingTime", time);
    },
    async fetchNewBookings(since) {
      return await this.limoexpress._makeRequest({
        path: "/bookings",
        params: {
          created_after: since,
        },
      });
    },
  },
  hooks: {
    async deploy() {
      const { results } = await this.limoexpress._makeRequest({
        path: "/bookings",
      });

      results.slice(0, 50).forEach((booking) => {
        this.$emit(booking, {
          id: booking.id,
          summary: `New Booking: ${booking.id}`,
          ts: new Date(booking.created_at).getTime(),
        });
      });

      if (results.length) {
        this._setLastBookingTime(results[0].created_at);
      }
    },
  },
  async run() {
    const lastBookingTime = this._getLastBookingTime();
    const { results: newBookings } = await this.fetchNewBookings(lastBookingTime);

    newBookings.forEach((booking) => {
      const ts = new Date(booking.created_at).getTime();
      if (ts > new Date(lastBookingTime).getTime()) {
        this.$emit(booking, {
          id: booking.id,
          summary: `New Booking: ${booking.id}`,
          ts,
        });
      }
    });

    if (newBookings.length) {
      this._setLastBookingTime(newBookings[0].created_at);
    }
  },
};
