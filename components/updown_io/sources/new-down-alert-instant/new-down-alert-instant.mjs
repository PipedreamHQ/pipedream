import updown_io from "../../updown_io.app.mjs";

export default {
  key: "updown_io-new-down-alert-instant",
  name: "New Down Alert Instant",
  description: "Emits new event when a website check reports as down",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    updown_io: {
      type: "app",
      app: "updown_io",
    },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
  },
  methods: {
    generateMeta(data) {
      const ts = new Date(data.time).getTime();
      return {
        id: data.check.token,
        summary: data.description,
        ts,
      };
    },
  },
  async run() {
    const since = this.db.get("since");
    const { data: events } = await this.updown_io.checkDown({
      since,
    });

    for (const event of events) {
      const meta = this.generateMeta(event);
      this.$emit(event, meta);
    }

    if (events.length) {
      this.db.set("since", new Date().toISOString());
    }
  },
};
