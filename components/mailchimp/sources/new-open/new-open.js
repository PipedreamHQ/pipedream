const common = require("../common/timer-based");

module.exports = {
  ...common,
  key: "mailchimp-new-open",
  name: "New Open",
  description:
    "Emit new event when a recipient opens an email in a specific campaign.",
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
      "The unique ID of the campaign you'd like to watch for new email opens on links.",
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
      this.mailchimp.setDbServiceVariable("recipientOpens", campaign.report_summary.opens);
      this.processEvent(campaign);
    },
  },
  methods: {
    ...common.methods,
    generateMeta(eventPayload) {
      const ts = +new Date();
      return {
        id: ts,
        summary: `Campaign "${eventPayload.settings.title}" now has ${eventPayload.report_summary.opens} recipient opens.`,
        ts,
      };
    },
    processEvent(eventPayload) {
      const meta = this.generateMeta(eventPayload);
      this.$emit(eventPayload, meta);
    },
  },
  async run() {
    const savedRecipientOpens = parseInt(this.mailchimp.getDbServiceVariable("recipientOpens"));
    const campaign = await this.mailchimp.getCampaignInfo(
      this.campaignId,
    );
    if (!campaign) {
      console.log("No data available, skipping iteration");
      return;
    }
    const currentRecipientOpens = parseInt(
      campaign.report_summary.opens,
    );
    if (currentRecipientOpens > savedRecipientOpens) {
      this.mailchimp.setDbServiceVariable("recipientOpens", currentRecipientOpens);
      this.processEvent(campaign);
    }
  },
};
