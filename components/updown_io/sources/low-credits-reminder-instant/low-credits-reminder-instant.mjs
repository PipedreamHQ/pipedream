import updown_io from "../../updown_io.app.mjs";

export default {
  key: "updown_io-low-credits-reminder-instant",
  name: "Low Credits Reminder Instant",
  description: "Emits an event when the account balance is low. You can set a customizable threshold for when alerts should be triggered.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    updown_io,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
    threshold: {
      propDefinition: [
        updown_io,
        "threshold",
      ],
    },
  },
  methods: {
    calculateNextCheckPoint(lastCheckPoint) {
      const now = new Date();
      if (!lastCheckPoint) {
        return now;
      }
      const nextCheckPoint = new Date(lastCheckPoint.getTime() + this.timer.intervalSeconds * 1000);
      return now < nextCheckPoint
        ? nextCheckPoint
        : now;
    },
    generateMeta(data) {
      const {
        id, created_at,
      } = data;
      return {
        id,
        summary: `Low credits reminder at ${created_at}`,
        ts: Date.parse(created_at),
      };
    },
  },

  async run() {
    const lastCheckPoint = this.db.get("lastCheckPoint");
    const nextCheckPoint = this.calculateNextCheckPoint(new Date(lastCheckPoint));

    const lowBalanceEvents = await this.updown_io.checkLowBalance();
    lowBalanceEvents
      .filter((event) => Date.parse(event.created_at) >= nextCheckPoint.getTime())
      .forEach((event) => {
        const { balance } = event;
        if (balance <= this.threshold) {
          const meta = this.generateMeta(event);
          this.$emit(event, meta);
        }
      });

    this.db.set("lastCheckPoint", nextCheckPoint);
  },
};
