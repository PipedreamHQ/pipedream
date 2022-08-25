import statuscake from "../../statuscake.app.mjs";

export default {
  name: "New Uptime Alert",
  version: "0.0.1",
  key: "statuscake-new-uptime-alert",
  description: "Emit new event on each new uptime alert.",
  type: "source",
  dedupe: "unique",
  props: {
    statuscake,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      static: {
        intervalSeconds: 15 * 60, // 15 minutes
      },
    },
    uptimeId: {
      propDefinition: [
        statuscake,
        "uptimeId",
      ],
    },
  },
  methods: {
    emitEvent(data) {
      this.$emit(data, {
        id: data.id,
        summary: `New alert with id ${data.id}`,
        ts: new Date(),
      });
    },
  },
  hooks: {
    async deploy() {
      const alerts = await this.statuscake.getAlerts({
        uptimeId: this.uptimeId,
        params: {
          limit: 10,
        },
      });

      alerts.reverse().forEach(this.emitEvent);
    },
  },
  async run() {
    let page = 1;

    while (page >= 0) {
      const alerts = await this.statuscake.getAlerts({
        uptimeId: this.uptimeId,
        params: {
          page,
          limit: 100,
        },
      });

      alerts.reverse().forEach(this.emitEvent);

      if (alerts.length < 100) {
        return;
      }

      page++;
    }
  },
};
