import youcanbook_me from "../../youcanbook_me.app.mjs";

export default {
  props: {
    youcanbook_me,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 15 * 60,
      },
    },
  },
  methods: {
    async emitEvent() { },
  },
  hooks: {
    async deploy() {
      const bookings = await this.youcanbook_me.getBookings({});

      bookings.forEach(this.emitEvent);
    },
  },
  async run() {
    const response = await this.youcanbook_me.getBookings({});

    response.forEach(this.emitEvent);
  },
};
