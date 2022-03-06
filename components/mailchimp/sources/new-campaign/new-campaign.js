const common = require("../common/timer-based");
const moment = require("moment");

module.exports = {
  ...common,
  key: "mailchimp-new-campaign",
  name: "New Campaign",
  description: "Emit new event when a campaign is created or sent.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    type: {
      type: "string",
      label: "type",
      description:
        "There are four types of campaigns you can create in Mailchimp. A/B Split campaigns have been deprecated and variate campaigns should be used instead. ",
      options: [
        "regular",
        "plaintext",
        "absplit",
        "rss",
        "variate",
      ],
      optional: false,
    },
    status: {
      type: "string",
      label: "status",
      description: "Campaign status to watch for.",
      options: [
        "created",
        "sent",
      ],
      default: "created",
    },
  },
  hooks: {
    async deploy() {
      // Emits sample events on the first run during deploy.
      const config = {
        count: 10,
        offset: 0,
        status: this.status,
      };
      const mailchimpCampaignsInfo = await this.mailchimp.getMailchimpCampaigns(config);
      const { campaigns: mailchimpCampaigns = [] } = mailchimpCampaignsInfo;
      if (!mailchimpCampaigns.length) {
        console.log("No data available, skipping iteration");
        return;
      }
      const sinceDate = this.mailchimp._statusIsSent(this.status)
        ? mailchimpCampaigns[0].send_time
        : mailchimpCampaigns[0].create_time;
      this.db.set("lastSinceDate", sinceDate);
      mailchimpCampaigns.reverse().forEach(this.processEvent);
    },
  },
  methods: {
    ...common.methods,
    generateMeta(eventPayload) {
      const eventDatedAt = this.mailchimp._statusIsSent(eventPayload.status)
        ? eventPayload.send_time
        : eventPayload.create_time;
      const ts = +new Date(eventDatedAt);
      return {
        id: eventPayload.id,
        summary: `Campaign "${eventPayload.settings.title}" was ${eventPayload.status}.`,
        ts,
      };
    },
    processEvent(eventPayload) {
      const meta = this.generateMeta(eventPayload);
      this.$emit(eventPayload, meta);
    },
  },
  async run() {
    const beforeDate = moment().toISOString();
    let sinceDate = this.db.get("lastSinceDate");
    let mailchimpCampaignsInfo;
    let mailchimpCampaigns;
    let offset = 0;
    const config = {
      count: 1000,
      offset,
      status: this.status,
      beforeDate,
    };
    do {
      config.sinceDate = sinceDate;
      config.offset = offset;
      mailchimpCampaignsInfo = await this.mailchimp.getMailchimpCampaigns(config);
      mailchimpCampaigns = mailchimpCampaignsInfo.campaigns;
      if (!mailchimpCampaigns.length) {
        console.log("No data available, skipping iteration");
        return;
      }
      sinceDate = this.mailchimp._statusIsSent(this.status)
        ? mailchimpCampaigns[0].send_time
        : mailchimpCampaigns[0].create_time;
      this.db.set("lastSinceDate", sinceDate);
      mailchimpCampaigns.reverse().forEach(this.processEvent);
      offset = offset + mailchimpCampaigns.length;
    } while (mailchimpCampaigns.length > 0);
  },
};
