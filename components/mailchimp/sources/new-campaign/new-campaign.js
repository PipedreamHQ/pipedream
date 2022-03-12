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
      };
      let campaigns;
      if(this.mailchimp.statusIsSent(this.status)) {
        campaigns = await this.mailchimp.getCampaignsBySentDate(config); //TODO Confirm new method usage.
      } else {
        campaigns = await this.mailchimp.getCampaignsByCreationDate(config); //TODO Confirm new method usage.
      }      
      if (!campaigns.length) {
        console.log("No data available, skipping iteration");
        return;
      }
      const sinceDate = this.mailchimp.getCampaignTimestamp(campaigns[0], this.status);
      campaigns.forEach(this.processEvent);
      this.mailchimp.setDbServiceVariable("lastSinceDate", sinceDate);
    },
  },
  methods: {
    ...common.methods,
    generateMeta(eventPayload) {
      const eventDatedAt = this.mailchimp.getCampaignTimestamp(eventPayload, eventPayload.status);//TODO Confirm new method usage.
      const ts = Date.parse(eventDatedAt);
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
    const pageSize = 1000;
    let sinceDate = this.mailchimp.getDbServiceVariable("lastSinceDate");
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
        campaigns = await this.mailchimp.getCampaignsBySentDate(config); //TODO Confirm new method usage.
      } else {
        campaigns = await this.mailchimp.getCampaignsByCreationDate(config); //TODO Confirm new method usage.
      }     
      if (!campaigns.length) {
        console.log("No data available, skipping iteration");
        return;
      }
      sinceDate = this.mailchimp.getCampaignTimestamp(campaigns[0], this.status);      
      campaigns.forEach(this.processEvent);
      this.mailchimp.setDbServiceVariable("lastSinceDate", sinceDate);
      offset = offset + campaigns.length;
    } while (campaigns.length  === pageSize);
  },
};
