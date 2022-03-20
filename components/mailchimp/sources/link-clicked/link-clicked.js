const common = require("../common/timer-based");

module.exports = {
  ...common,
  key: "mailchimp-link-clicked",
  name: "Link Clicked",
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
    linkId: {
      type: "string",
      label: "Campaign Link",
      description: "The campaign link to track for clicks",
      async options() {
        // A call to `mailchimp.reports.getCampaignClickDetails`
        const links = await this.mailchimp.getCampaignLinks(this.campaignId);
        return links.map((link) => ({
          label: link.url,
          value: link.id,
        }));
      },
    },
    uniqueClicksOnly: {
      type: "boolean",
      label: "Unique Clicks Only?",
      description: "Whether to count every link click or only count clicks coming from each user only once",
      default: false,
    },
  },
  hooks: {
    async deploy() {
      // Emits sample events on the first run during deploy.
      const campaign = await this.mailchimp.getCampaignClickDetailsForLink(
        this.campaignId,
        this.linkId,
      );
      if (!campaign) {
        console.log("No data available, skipping iteration");
        return;
      }
      this.emitEvent(campaign);
      this.setDbServiceVariable("recipientClicks", campaign.report_summary.clicks);
    },
  },
  methods: {
    ...common.methods,
    generateMeta({
      eventPayload,
      clickDiff,
      timestamp: ts,
    }) {
      const { id: linkId } = eventPayload;
      return {
        id: `${linkId}-${ts}`,
        summary: `${clickDiff} new clicks`,
        ts,
      };
    },
  async run({ timestamp }) {
      const savedRecipientClicks = this.getDbServiceVariable("recipientClicks");
      const campaignLinkReport = await this.mailchimp.getCampaignLinkReport(
        this.campaignId,
        this.linkId,
      );
      const currentRecipientClicks = this.uniqueClicksOnly
        ? campaignLinkReport.unique_clicks
        : campaignLinkReport.total_clicks;
      if (!campaignLinkReport) {
        throw new Error("Campaign not found");
      }
      const clickDiff = currentRecipientClicks - savedRecipientClicks;
      if (clickDiff <= 0) {
        console.log("No new clicks. Skipping...");
        return;
      }
      this.emitEvent({
        eventPayload: campaignLinkReport,
        clickDiff,
        timestamp,
      });
      this.setDbServiceVariable("recipientClicks", currentRecipientClicks);
    },
  }
};
