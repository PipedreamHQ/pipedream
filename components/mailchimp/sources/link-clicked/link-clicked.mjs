import common from "../common/timer-based.mjs";

export default {
  ...common,
  key: "mailchimp-link-clicked",
  name: "Link Clicked",
  description: "Emit new event when a recipient clicks a pre-specified link in an specific campaign.",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    campaignId: {
      propDefinition: [
        common.props.mailchimp,
        "campaignId",
      ],
      description: "The unique ID of the campaign you'd like to watch for new clicks on links",
    },
    linkId: {
      propDefinition: [
        common.props.mailchimp,
        "linkId",
        (c) => ({
          campaignId: c.campaignId,
        }),
      ],
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
      return this.emitReportSampleEvents(this.campaignId, this.linkId, (Date.now()));
    },
  },
  methods: {
    ...common.methods,
    getEventTypes() {
      return [
        "clicks",
      ];
    },
    generateMeta({
      eventPayload,
      diff: clickDiff,
      timestamp: ts,
    }) {
      const { id: linkId } = eventPayload;
      return {
        id: `${linkId}-${ts}`,
        summary: `${clickDiff} new clicks`,
        ts,
      };
    },
    getCachedCampaignDetails() {
      return this.getDbServiceVariable("recipientClicks");
    },
    async getCampaignDetails() {
      return this.mailchimp.getCampaignClickDetailsForLink(
        this.campaignId,
        this.linkId,
      );
    },
    getNodataErrorMessage() {
      return "No data found for specified campaign and link.";
    },
    getCurrentCampaignDetails(report) {
      return this.uniqueClicksOnly
        ? report.unique_clicks
        : report.total_clicks;
    },
    getDetailsDiff(currentRecipientClicks, recipientClicks) {
      return currentRecipientClicks - recipientClicks;
    },
    cacheCampaignDetails(currentRecipientClicks) {
      if (isNaN(currentRecipientClicks)) {
        if (this.uniqueClicksOnly) {
          this.setDbServiceVariable("recipientClicks", currentRecipientClicks.unique_clicks);
        } else {
          this.setDbServiceVariable("recipientClicks", currentRecipientClicks.total_clicks);
        }
      } else {
        this.setDbServiceVariable("recipientClicks", currentRecipientClicks);
      }
    },
    clearCampaignDetailsCache() {
      this.setDbServiceVariable("recipientClicks", 0);
    },
  },
  async run() {
    return this.emitReportEvents();
  },
};
