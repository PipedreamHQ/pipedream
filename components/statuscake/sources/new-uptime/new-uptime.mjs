import statuscake from "../../statuscake.app.mjs";

export default {
  name: "New Uptime",
  version: "0.0.1",
  key: "statuscake-new-uptime",
  description: "Emit new event for each uptime created.",
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
  },
  methods: {
    emitEvent(data) {
      this.$emit(data, {
        id: data.id,
        summary: `New uptime with id ${data.id}`,
        ts: new Date(),
      });
    },
  },
  hooks: {
    async deploy() {
      const uptimes = await this.statuscake.getUptimes({
        uptimeId: this.uptimeId,
        params: {
          limit: 10,
        },
      });

      uptimes.reverse().forEach(this.emitEvent);
    },
  },
  async run() {
    let page = 1;

    while (page >= 0) {
      const uptimes = await this.statuscake.getUptimes({
        uptimeId: this.uptimeId,
        params: {
          page,
          limit: 100,
        },
      });

      uptimes.reverse().forEach(this.emitEvent);

      if (uptimes.length < 100) {
        return;
      }

      page++;
    }
  },
};
