import analytics from "../../google_analytics.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import utils from "../../common/utils.mjs";

export default {
  key: "google_analytics-page-opened",
  version: "0.2.0",
  name: "New Page Opened (GA4)",
  description: "Emit new event when a page is viewed (uses GA4 Data API)",
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
    property: {
      propDefinition: [
        analytics,
        "property",
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

      const propertyId = this.property.replace("properties/", "");

      const report = await this.analytics.queryReportsGA4({
        property: propertyId,
        data: {
          dateRanges: [
            {
              startDate,
              endDate: "today",
            },
          ],
          metrics: [
            {
              name: "screenPageViews",
            },
          ],
        },
      });

      const previousPageViews = this._getPageViews();

      const pageViews = report?.rows?.[0]?.metricValues?.[0]?.value
        || report?.totals?.[0]?.metricValues?.[0]?.value
        || "0";

      if (!previousPageViews || parseInt(pageViews) > parseInt(previousPageViews)) {
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
