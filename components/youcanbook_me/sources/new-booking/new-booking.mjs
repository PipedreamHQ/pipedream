import youcanbook_me from "../../youcanbook_me.app.mjs";

export default {
  name: "New Booking",
  version: "0.0.1",
  key: "youcanbook_me-new-booking",
  description: "Emit new event for each new booking",
  type: "source",
  props: {
    youcanbook_me,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 15 * 60,
      },
    },
  },
  methods: {
    async emitEvent(event) {
      this.$emit(event, {
        id: event.id,
        summary: `New booking with id ${event.id}`,
        ts: Date.parse(event.createdAt),
      });
    },
  },
  async run() {
    const response = await this.youcanbook_me.getBookings({});

    response.forEach(this.emitEvent);
  },
};
