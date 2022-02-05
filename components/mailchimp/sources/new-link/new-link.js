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
      const mailchimpCampaign = await this.mailchimp.getMailchimpCampaignInfo(
        this.campaignId,
      );
      if (!mailchimpCampaign) {
        console.log("No data available, skipping iteration");
        return;
      }
      this.db.set("recipientClicks", mailchimpCampaign.report_summary.clicks);
      this.processEvent(mailchimpCampaign);
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
    const savedRecipientClicks = parseInt(this.db.get("recipientClicks"));
    const mailchimpCampaign = await this.mailchimp.getMailchimpCampaignInfo(
      this.campaignId,
    );
    if (!mailchimpCampaign) {
      console.log("No data available, skipping iteration");
      return;
    }
    const currentRecipientClicks = parseInt(
      mailchimpCampaign.report_summary.clicks,
    );
    if (currentRecipientClicks > savedRecipientClicks) {
      this.db.set("recipientClicks", currentRecipientClicks);
      this.processEvent(mailchimpCampaign);
    }
  },
};
