import mailchimp from "@mailchimp/mailchimp_marketing";
import retry from "async-retry";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "mailchimp-link-clicked",
  name: "Link Clicked",
  description: "Emit new event when a recipient clicks a pre-specified link in an specific campaign.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    mailchimp: {
      type: "app",
      app: "mailchimp",
    },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    campaignId: {
      type: "string",
      label: "Campaign ID",
      description: "The unique ID of the campaign you'd like to watch for new clicks on links",
      useQuery: true,
      async options({ page }) {
        const count = 1000;
        const offset = count * page;
        const campaigns = await this.getCampaignsByCreationDate({
          count,
          offset,
        });
        return campaigns.map((campaign) => {
          const lsdIdx = campaign.long_archive_url.lastIndexOf("/");
          const campaignName = lsdIdx > 0
            ? campaign.long_archive_url.substring(lsdIdx + 1)
            : "";
          const label = `Campaign ID/Name from URL (if any): ${campaign.id}/${campaignName}`;
          return {
            label,
            value: campaign.id,
          };
        });
      },
    },
    linkId: {
      type: "string",
      label: "Campaign Link",
      description: "The campaign link to track for clicks",
      async options(opts) {
        const links = await this.getCampaignClickDetails(opts.campaignId);
        if (!links.urls_clicked.length) {
          throw new Error("No link data available for the selected campaignId");
        }
        return links.urls_clicked.map((link) => ({
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
      return this.emitReportSampleEvents(this.campaignId, this.linkId, (Date.now()));
    },
  },
  methods: {
    _auths() {
      return this.mailchimp.$auth;
    },
    _authToken() {
      return this.mailchimp.$auth.oauth_access_token;
    },
    _server() {
      return this.mailchimp.$auth.dc;
    },
    api() {
      mailchimp.setConfig({
        accessToken: this._authToken(),
        server: this._server(),
      });
      return mailchimp;
    },
    _isRetriableStatusCode(statusCode) {
      [
        408,
        429,
        500,
      ].includes(statusCode);
    },
    async _withRetries(apiCall) {
      const retryOpts = {
        retries: 5,
        factor: 2,
      };
      return retry(async (bail) => {
        try {
          return await apiCall();
        } catch (err) {
          const { status = 500 } = err;
          if (!this._isRetriableStatusCode(status)) {
            bail(`
              Unexpected error (status code: ${status}):
              ${JSON.stringify(err.response)}
            `);
          }

          throw err;
        }
      }, retryOpts);
    },
    async listCampaignOpenDetails(campaignId) {
      return await this._withRetries(() => this.api().reports.getCampaignOpenDetails(campaignId));
    },
    async getCampaignClickDetailsForLink(campaignId, linkId) {
      const mailchimp = this.api();
      return await this._withRetries(() =>
        mailchimp.reports.getCampaignClickDetailsForLink(campaignId, linkId));
    },
    async emitReportSampleEvents(reportId, rptParamId, timestamp) {
      this.clearCampaignDetailsCache();
      let report;
      if (this.getEventTypes().includes("opens")) {
        report = await this.listCampaignOpenDetails(
          reportId,
        );
      } else {
        report = await this.getCampaignClickDetailsForLink(
          reportId,
          rptParamId,
        );
      }
      if (!report) {
        throw new Error("Report metrics not found.");
      }
      const diff = this.getEventTypes().includes("opens") ?
        report.total_opens :
        report.total_clicks;
      this.processEvent({
        eventPayload: report,
        diff,
        timestamp,
      });
      this.cacheCampaignDetails(report);
    },
    async emitReportEvents() {
      const cachedDetails = this.getCachedCampaignDetails();
      const detailsInfo = await this.getCampaignDetails();
      const currentDetails = this.getCurrentCampaignDetails(detailsInfo);
      if (!detailsInfo) {
        throw new Error(this.getNodataErrorMessage());
      }
      const diff = this.getDetailsDiff(currentDetails, cachedDetails);
      if (diff <= 0) {
        console.log(`No new ${this.getEventTypes()[0]}. Skipping...`);
        return;
      }
      this.processEvent({
        eventPayload: detailsInfo,
        diff,
        timestamp: (new Date()).getTime(),
      });
      this.cacheCampaignDetails(currentDetails);
    },
    slugifyEmail(email) {
      return email
        .replace(/[@]/g, "-at-")
        .replace(/[.]/g, "-");
    },
    getDbServiceVariable(variable) {
      return this.db.get(`${variable}`);
    },
    processEvent(event) {
      const meta = this.generateMeta(event);
      this.$emit(event, meta);
    },
    setDbServiceVariable(variable, value) {
      this.db.set(`${variable}`, value);
    },

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
      return this.getCampaignClickDetailsForLink(
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
