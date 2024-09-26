import analytics from "../../google_analytics.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import utils from "../../common/utils.mjs";

export default {
  key: "google_analytics-page-opened",
  version: "0.1.0",
  name: "New Page Opened",
  description: "Emit new event when a page is viewed",
  type: "source",
  dedupe: "unique",
  props: {
    analytics,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    viewId: {
      propDefinition: [
        analytics,
        "viewId",
      ],
    },
  },
  hooks: {
    async deploy() {
      const startDate = utils.monthAgo();
      this._setStartDate(startDate);
      await this.processEvent();
    },
  },
  methods: {
    _getPageViews() {
      return this.db.get("pageViews");
    },
    _setPageViews(pageViews) {
      this.db.set("pageViews", pageViews);
    },
    _getStartDate() {
      return this.db.get("startDate");
    },
    _setStartDate(startDate) {
      this.db.set("startDate", startDate);
    },
    generateMeta(pageViews, startDate) {
      const ts = Date.now();
      return {
        id: ts,
        summary: `${pageViews} page views since ${startDate}`,
        ts,
      };
    },
    async processEvent() {
      const startDate = this._getStartDate();
      const data = {
        resource: {
          reportRequests: [
            {
              viewId: this.viewId,
              dateRanges: [
                {
                  startDate,
                  endDate: "today",
                },
              ],
              metrics: [
                {
                  expression: "ga:pageviews",
                },
              ],
            },
          ],
        },
      };
      const { data: report } = await this.analytics.queryReports(data);

      const previousPageViews = this._getPageViews();
      const pageViews = report.reports[0].data.totals[0].values[0];

      if (!previousPageViews || pageViews > previousPageViews) {
        this._setPageViews(pageViews);
        const meta = this.generateMeta(pageViews, startDate);
        this.$emit(report, meta);
      }
    },
  },
  async run() {
    await this.processEvent();
  },
};
