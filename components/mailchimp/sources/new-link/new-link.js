const common = require("../common/timer-based");

module.exports = {
  ...common,
  key: "mailchimp-new-link",
  name: "New Link",
  description:
    "Emit new event when a recipient clicks a pre-specified link in an specific campaign.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    campaignId: {
      propDefinition: [
        common.props.mailchimp,
        "campaignId",
      ],
      description:
        "The unique ID of the campaign you'd like to watch for new clicks on links.",
    },
  },
  hooks: {
    async deploy() {
      // Emits sample events on the first run during deploy.
      const campaign = await this.mailchimp.getCampaignInfo(
        this.campaignId,
      );
      if (!campaign) {
        console.log("No data available, skipping iteration");
        return;
      }
      this.mailchimp.setDbServiceVariable("recipientClicks", campaign.report_summary.clicks);
      this.processEvent(campaign);
    },
  },
  methods: {
    ...common.methods,
    generateMeta(eventPayload) {
      const ts = +new Date();
      return {
        id: ts,
        summary: `Campaign "${eventPayload.settings.title}" now has ${eventPayload.report_summary.clicks} subscriber clicks.`,
        ts,
      };
    },
    processEvent(eventPayload) {
      const meta = this.generateMeta(eventPayload);
      this.$emit(eventPayload, meta);
    },
  },
  async run() {
    const savedRecipientClicks = parseInt(this.mailchimp.getDbServiceVariable("recipientClicks"));
    const campaign = await this.mailchimp.getCampaignInfo(
      this.campaignId,
    );
    if (!campaign) {
      console.log("No data available, skipping iteration");
      return;
    }
    const currentRecipientClicks = parseInt(
      campaign.report_summary.clicks,
    );
    if (currentRecipientClicks > savedRecipientClicks) {
      this.mailchimp.setDbServiceVariable("recipientClicks", currentRecipientClicks);
      this.processEvent(campaign);
    }
  },
};
