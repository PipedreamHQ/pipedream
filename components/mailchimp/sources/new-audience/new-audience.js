const common = require("../common/timer-based");

module.exports = {
  ...common,
  key: "new-audience",
  name: "New Audience",
  description:
    "Emit new event when an audience is added to the connected Mailchimp account.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  hooks: {
    async deploy() {
      // Emits sample events on the first run during deploy.
      const audiences =
        await this.mailchimp.getAudienceLists({
          count: 1000,
          beforeDateCreated: null,
          sinceDateCreated: null,
        });
      if (!audiences.length) {
        throw new Error("No campaign data available");
      }
      audiences.forEach(this.processEvent);
      this.setDbServiceVariable("lastDateCreated", audiences[0].date_created);
    },
  },
  methods: {
    ...common.methods,
    generateMeta(eventPayload) {
      const ts = Date.parse(eventPayload.created_at);
      return {
        id: eventPayload.id,
        summary: `New audience list: ${eventPayload.name}`,
        ts,
      };
    },
  },
  async run() {
    const sinceDateCreated = this.getDbServiceVariable("lastDateCreated");
    const beforeDateCreated = (new Date).toISOString();
    const pageSize = 1000;
    let audiences;
    let offset = 0;
    do {
      audiences =
        await this.mailchimp.getAudienceLists({
          count: pageSize,
          offset,
          beforeDateCreated,
          sinceDateCreated,
        });
      if (!audiences.length) {
        throw new Error("No audience data available");
      }
      audiences.forEach(this.processEvent);
      this.setDbServiceVariable("lastDateCreated", audiences[0].date_created);
      offset += audiences.length;
    } while (audiences.length === pageSize);
  },
};
