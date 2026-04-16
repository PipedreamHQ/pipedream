import common from "../common/timer-based.mjs";
import constants from "../constants.mjs";

export default {
  ...common,
  key: "mailchimp-new-campaign",
  name: "New Campaign",
  description: "Emit new event when a new campaign is created or sent",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    type: {
      type: "string",
      label: "type",
      description: "There are four types of campaigns you can create in Mailchimp. A/B Split campaigns have been deprecated and variate campaigns should be used instead. ",
      options: constants.CAMPAIGN_TYPES,
      optional: false,
    },
    status: {
      type: "string",
      label: "status",
      description: "Campaign status to watch for.",
      options: constants.CAMPAIGN_STATUSES,
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
      const campaigns = this.mailchimp.statusIsSent(this.status)
        ? await this.mailchimp.getCampaignsBySentDate(config)
        : await this.mailchimp.getCampaignsByCreationDate(config);
      const sinceDate = campaigns?.length
        ? this.mailchimp.getCampaignTimestamp(campaigns[0], this.status)
        : Date.now();
      if (campaigns?.length) {
        campaigns.status = this.status;
        campaigns.forEach(this.processEvent);
      }
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
    const pageSize = constants.PAGE_SIZE;
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
      campaigns = this.mailchimp.statusIsSent(this.status)
        ? await this.mailchimp.getCampaignsBySentDate(config)
        : await this.mailchimp.getCampaignsByCreationDate(config);
      if (!campaigns?.length) {
        throw new Error("No campaign data available");
      }
      sinceDate = this.mailchimp.getCampaignTimestamp(campaigns[0], this.status);
      campaigns.forEach(this.processEvent);
      this.setDbServiceVariable("lastSinceDate", sinceDate);
      offset = offset + campaigns.length;
    } while (campaigns.length  === pageSize);
  },
};
