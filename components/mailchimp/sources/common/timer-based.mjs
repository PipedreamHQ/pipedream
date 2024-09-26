import base from "./base.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  ...base,
  props: {
    ...base.props,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    ...base.methods,
    getEventTypes() {
      throw new Error("getEventType is not implemented");
    },
    async emitReportSampleEvents(reportId, rptParamId, timestamp) {
      this.clearCampaignDetailsCache();
      let report;
      if (this.getEventTypes().includes("opens")) {
        report = await this.mailchimp.listCampaignOpenDetails(
          reportId,
        );
      } else {
        report = await this.mailchimp.getCampaignClickDetailsForLink(
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
  },
};
