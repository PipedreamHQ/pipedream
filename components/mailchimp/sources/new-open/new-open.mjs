import common from "../common/timer-based.mjs";

export default {
  ...common,
  key: "mailchimp-new-open",
  name: "New Open",
  description: "Emit new event when a recipient opens an email in a specific campaign.",
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
      description: "The unique ID of the campaign you'd like to watch for new email opens on links.",
    },
    uniqueOpensOnly: {
      type: "boolean",
      label: "Unique Opens Only?",
      description: "Whether to count every open campaign email or only count opens coming from each subscriber only once",
      default: false,
    },
  },
  hooks: {
    async deploy() {
      // Emits sample events on the first run during deploy.
      return this.emitReportSampleEvents(this.campaignId, undefined, (Date.now()));
    },
  },
  methods: {
    ...common.methods,
    getEventTypes() {
      return [
        "opens",
      ];
    },
    generateMeta({
      eventPayload,
      diff: openDiff,
      timestamp: ts,
    }) {
      const { campaign_id: campaignId } = eventPayload;
      return {
        id: `${campaignId}-${ts}`,
        summary: `${openDiff} new opens`,
        ts,
      };
    },
    getCachedCampaignDetails() {
      return {
        total_opens: this.getDbServiceVariable("total_opens"),
        members: this.getDbServiceVariable("members"),
      };
    },
    async getCampaignDetails() {
      return this.mailchimp.listCampaignOpenDetails(
        this.campaignId,
      );
    },
    getNodataErrorMessage() {
      return "No campaign found.";
    },
    getCurrentCampaignDetails(campaignOpenReport) {
      return {
        total_opens: campaignOpenReport.total_opens,
        members: campaignOpenReport.members,
      };
    },
    getDetailsDiff(currentCampaignOpenReport, cachedCampaignOpenReport) {
      if (this.uniqueOpensOnly) {
        return (currentCampaignOpenReport.members.length | 0)
        - (cachedCampaignOpenReport.members.length | 0);
      }
      return currentCampaignOpenReport.total_opens - cachedCampaignOpenReport.total_opens;
    },
    cacheCampaignDetails(currentCampaignOpenReport) {
      this.setDbServiceVariable("total_opens", currentCampaignOpenReport.total_opens);
      this.setDbServiceVariable("members", {
        members: currentCampaignOpenReport.members,
      });
    },
    clearCampaignDetailsCache() {
      this.setDbServiceVariable("total_opens", 0);
      this.setDbServiceVariable("members", {
        members: [],
      });
    },
  },
  async run() {
    return this.emitReportEvents();
  },
};
