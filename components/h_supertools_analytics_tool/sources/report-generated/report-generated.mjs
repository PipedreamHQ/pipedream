import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import moment from "moment";
import app from "../../h_supertools_analytics_tool.app.mjs";

export default {
  name: "New Report Generated",
  version: "0.0.1",
  key: "h_supertools_analytics_tool-report-generated",
  description: "Emit new event when a new analytics report is created.",
  type: "source",
  dedupe: "unique",
  props: {
    app,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      static: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    reportId: {
      propDefinition: [
        app,
        "reportId",
      ],
    },
    name: {
      propDefinition: [
        app,
        "name",
      ],
    },
  },
  methods: {
    emitEvent(data) {
      this.$emit(data, {
        id: data.value + data.count,
        summary: "New analytics report created!",
        ts: new Date,
      });
    },
  },
  async run() {
    const {
      app,
      reportId,
      name,
    } = this;

    const items = app.paginate({
      fn: app.retrieveReportData,
      reportId,
      params: {
        name,
        from: "1970-01-01",
        to: moment().format("YYYY-MM-DD"),
        sort: "desc",
        per_page: 100,
      },
    });

    const response = [];

    for await (const item of items) {
      response.push(item);
    }

    response.reverse().forEach(this.emitEvent);
  },
};
