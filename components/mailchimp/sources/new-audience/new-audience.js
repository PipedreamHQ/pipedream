const common = require("../common/timer-based");
const moment = require("moment");

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
        await this.mailchimp.getMailchimpAudienceLists(
          10,
          0,
          null,
          null,
        );
      const { lists: mailchimpAudienceLists = [] } = mailchimpAudienceListsInfo;
      if (!mailchimpAudienceLists.length) {
        console.log("No data available, skipping iteration");
        return;
      }
      this.db.set("lastDateCreated", mailchimpAudienceLists[0].date_created);
      mailchimpAudienceLists.forEach(this.processEvent);
    },
  },
  methods: {
    ...common.methods,
    generateMeta(eventPayload) {
      const ts = +new Date(eventPayload.created_at);
      return {
        id: eventPayload.id,
        summary: `A new audience list "${eventPayload.name}" was created.`,
        ts,
      };
    },
    processEvent(eventPayload) {
      const meta = this.generateMeta(eventPayload);
      this.$emit(eventPayload, meta);
    },
  },
  async run() {
    const sinceDateCreated = this.db.get("lastDateCreated");
    const beforeDateCreated = moment().toISOString();
    let mailchimpAudienceListsInfo;
    let mailchimpAudienceLists;
    let offset = 0;
    do {
      mailchimpAudienceListsInfo =
        await this.mailchimp.getMailchimpAudienceLists(
          1000,
          offset,
          beforeDateCreated,
          sinceDateCreated,
        );
      mailchimpAudienceLists = mailchimpAudienceListsInfo.lists;
      if (!mailchimpAudienceLists.length) {
        console.log("No data available, skipping iteration");
        return;
      }
      mailchimpAudienceLists.forEach(this.processEvent);
      this.db.set("lastDateCreated", mailchimpAudienceLists[0].date_created);
      offset = offset + mailchimpAudienceLists.length;
    } while (mailchimpAudienceLists.length > 0);
  },
};
