const common = require("../common/timer-based");

module.exports = {
  ...common,
  key: "mailchimp-new-audience",
  name: "New Audience",
  description:
    "Emit new event when an audience is added to the connected Mailchimp account.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  hooks: {
    async deploy() {
      // Emits sample events on the first run during deploy.
      const mailchimpAudienceListsInfo =
        await this.mailchimp.getAudienceLists({
          beforeDateCreated: null,
          sinceDateCreated: null,
        });
      const { lists: mailchimpAudienceLists = [] } = mailchimpAudienceListsInfo;
      if (!mailchimpAudienceLists.length) {
        console.log("No data available, skipping iteration");
        return;
      }
      mailchimpAudienceLists.forEach(this.emitEvent);
      this.setDbServiceVariable("lastDateCreated", mailchimpAudienceLists[0].date_created);
    },
  },
  methods: {
    ...common.methods,
    generateMeta(eventPayload) {
      const ts = +new Date(eventPayload.created_at);
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
    let mailchimpAudienceListsInfo;
    let mailchimpAudienceLists;
    let offset = 0;
    do {
      mailchimpAudienceListsInfo =
        await this.mailchimp.getAudienceLists({
          count: 1000,
          offset,
          beforeDateCreated,
          sinceDateCreated,
        });
      mailchimpAudienceLists = mailchimpAudienceListsInfo.lists;
      if (!mailchimpAudienceLists.length) {
        console.log("No data available, skipping iteration");
        return;
      }
      mailchimpAudienceLists.forEach(this.emitEvent);
      this.setDbServiceVariable("lastDateCreated", mailchimpAudienceLists[0].date_created);
      offset += mailchimpAudienceLists.length;
    } while (mailchimpAudienceLists.length === pageSize);
  },
};
