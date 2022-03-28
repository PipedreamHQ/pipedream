const common = require("../common/timer-based");

module.exports = {
  ...common,
  key: "new-campaign",
  name: "New Campaign",
  description: "Whether to emit events when campaigns are created or when they are sent.",
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
      };
      let campaigns;
      if(this.mailchimp.statusIsSent(this.status)) {
        campaigns = await this.mailchimp.getCampaignsBySentDate(config);
      } else {
        campaigns = await this.mailchimp.getCampaignsByCreationDate(config);
      }
      if (!campaigns.length) {
        throw new Error("No campaign data available");
      }
      const sinceDate = this.mailchimp.getCampaignTimestamp(campaigns[0], this.status);
      campaigns.status = this.status;
      campaigns.forEach(this.processEvent);
      this.setDbServiceVariable("lastSinceDate", sinceDate);
    },
  },
  methods: {
    ...common.methods,
    generateMeta(eventPayload) {
      const eventDatedAt = this.mailchimp.getCampaignTimestamp(eventPayload, this.status);
      const ts = Date.parse(eventDatedAt);
      return {
        id: eventPayload.id,
        summary: `Campaign "${eventPayload.settings.title}" was ${this.status}.`,
        ts,
      };
    },
  },
  async run() {
    const beforeDate = (new Date).toISOString();
    const pageSize = 1000;
    let sinceDate = this.getDbServiceVariable("lastSinceDate");
    let campaigns;
    let offset = 0;
    const config = {
      count: pageSize,
      offset,
      status: this.status,
      beforeDate,
    };
    do {
      config.sinceDate = sinceDate;
      config.offset = offset;
      if(this.mailchimp.statusIsSent(this.status)) {
        campaigns = await this.mailchimp.getCampaignsBySentDate(config);
      } else {
        campaigns = await this.mailchimp.getCampaignsByCreationDate(config);
      }
      if (!campaigns.length) {
        throw new Error("No campaign data available");
      }
      sinceDate = this.mailchimp.getCampaignTimestamp(campaigns[0], this.status);
      campaigns.forEach(this.processEvent);
      this.setDbServiceVariable("lastSinceDate", sinceDate);
      offset = offset + campaigns.length;
    } while (campaigns.length  === pageSize);
  },
};
