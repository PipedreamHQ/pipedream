import {
  ConfigurationError,
  DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import app from "../../insites.app.mjs";

export default {
  dedupe: "unique",
  type: "source",
  key: "insites-analysis-complete",
  name: "New Analysis Complete",
  description: "Emit new event when a new analysis is completed. [See the documentation](https://help.insites.com/en/articles/7994946-report-api#h_e59622a8e7)",
  version: "0.0.2",
  props: {
    app,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    filter: {
      type: "string",
      label: "Filter",
      description: "JSON encoded string - attributes by which the reports should be filtered by. [See the documentation for more details](https://help.insites.com/en/articles/7994946-report-api#h_e59622a8e7). Example: `[{\"operator\":\"equal\",\"property\":\"mobile.is_mobile\",\"targetValue\":false}]`",
      optional: true,
    },
    includeHistoric: {
      type: "boolean",
      label: "Include Historic",
      description: "Whether the results should contain old versions of the business reports.",
      optional: true,
    },
    listId: {
      type: "string",
      label: "List ID",
      description: "Will filter the results and return only those in the given list. Note: list ID should be the 32-character hexadecimal ID provided by Insites (not the list name which is assigned by the user).",
      optional: true,
    },
  },
  methods: {
    setLastExecutionTime(time) {
      this.db.set("lastExecutionTime", time);
    },
    getLastExecutionTime() {
      const lastExecutionTime = this.db.get("lastExecutionTime");
      if (!lastExecutionTime) {
        const YESTERDAY = 86400000;
        return new Date(Date.now() - YESTERDAY).toISOString();
      }
      return new Date(lastExecutionTime).toISOString();
    },
    validateJsonString(obj) {
      if (typeof obj !== "string") {
        return obj;
      }
      try {
        return JSON.parse(obj);
      } catch (err) {
        throw new ConfigurationError("Filter must be a valid JSON string.");
      }
    },
    emitEvent(report) {
      const meta = this.generateMeta(report);
      this.$emit(report, meta);
    },
    generateMeta(report) {
      return {
        id: report.report_id,
        summary: report.domain,
        ts: report.meta.report_completed_at,
      };
    },
  },
  async run() {
    let userFilter = [];
    if (this.filter) {
      userFilter = this.validateJsonString(this.filter);
    }
    const lastExecutionTime = this.getLastExecutionTime();
    const filter = [
      {
        "property": "report.meta.report_completed_at",
        "operator": "more_than",
        "targetValue": lastExecutionTime,
        "numeric": "false",
      },
    ];

    const data = [];
    const LIMIT = 100;
    let offset = 0;
    while (true) {
      const res = await this.app.searchAllReports({
        filter: JSON.stringify(filter.concat(userFilter)),
        offset,
        limit: LIMIT,
        include_historic: this.includeHistoric,
        list_id: this.listId,
      });
      if (!res.reports || res.reports.length === 0) {
        break;
      }
      data.push(...res.reports);
      offset += LIMIT;
    }

    for (const report of data.reverse()) {
      this.emitEvent(report);
    }
  },
};
