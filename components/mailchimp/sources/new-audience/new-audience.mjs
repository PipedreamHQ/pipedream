import common from "../common/timer-based.mjs";
import constants from "../constants.mjs";

export default {
  ...common,
  key: "mailchimp-new-audience",
  name: "New Audience",
  description: "Emit new event when an audience is added to the connected Mailchimp account.",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  hooks: {
    async deploy() {
      // Emits sample events on the first run during deploy.
      const audiences =
        await this.mailchimp.getAudienceLists({
          count: constants.PAGE_SIZE,
          beforeDateCreated: null,
          sinceDateCreated: null,
        });
      if (!audiences?.length) {
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
    const pageSize = constants.PAGE_SIZE;
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
      if (!audiences?.length) {
        return;
      }
      audiences.forEach(this.processEvent);
      this.setDbServiceVariable("lastDateCreated", audiences[0].date_created);
      offset += audiences.length;
    } while (audiences.length === pageSize);
  },
};
