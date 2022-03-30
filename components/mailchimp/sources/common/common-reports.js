const timerBased = require("./timer-based");

module.exports = {
  ...timerBased,
  props: {
    ...timerBased.props,
  },
  methods: {
    ...timerBased.methods,
    cacheCampaignDetails() {
        throw new Error("cacheCampaignDetails is not implemented");
    },
    clearCampaignDetailsCache() {
        throw new Error("clearCampaignDetailsCache is not implemented");
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
    async emitReportSampleEvents(reportId, rptParamId, timestamp){
        this.clearCampaignDetailsCache();
        let report;
        if(this.getEventTypes().includes("opens")){
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
    getCachedCampaignDetails() {
        throw new Error("getCachedCampaignDetails is not implemented");
    },
    async getCampaignDetails() {
        throw new Error("getCampaignDetails is not implemented");
    },
    getCurrentCampaignDetails() {
        throw new Error("getCurrentCampaignDetails is not implemented");
    },
    getDetailsDiff() {
        throw new Error("getDetailsDiff is not implemented");
    },
    getNodataErrorMessage() {
        throw new Error("getNodataErrorMessage is not implemented");
    },
};
