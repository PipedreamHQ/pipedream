import drata from "../../drata.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

const docsLink = "https://developers.drata.com/docs/openapi/reference/operation/MonitorsPublicController_listMonitors/";

export default {
  key: "drata-failed-monitor",
  name: "Failed Monitor",
  description: `Emit a new event whenever a monitor fails. [See the documentation](${docsLink}).`,
  type: "source",
  version: "0.0.3",
  dedupe: "unique",
  props: {
    drata,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    checkType: {
      type: "string",
      label: "Check Type",
      description: "Filter monitors by check type (associated monitor instances)",
      optional: true,
      options: [
        "POLICY",
        "IN_DRATA",
        "AGENT",
        "INFRASTRUCTURE",
        "VERSION_CONTROL",
        "IDENTITY",
        "TICKETING",
        "HRIS",
        "OBSERVABILITY",
      ],
    },
  },
  hooks: {
    async deploy() {
      const response = await this.drata.listMonitors({
        paginate: true,
        params: {
          checkResultStatus: "FAILED",
          reportInterval: "WEEKLY",
        },
      });

      const visitedIds = {};
      for (const monitor of response.data) {
        const ts = Date.parse(monitor.lastCheck);
        visitedIds[monitor.id] = ts;

        this.$emit(monitor, {
          id: `${monitor.id}_${ts}`,
          summary: `Historical failed monitor event: ${monitor.name}`,
          ts,
        });
      }

      this._setVisitedIds(visitedIds);
    },
  },
  methods: {
    _getVisitedIds() {
      return this.db.get("visitedIds") || {};
    },
    _setVisitedIds(visitedIds) {
      this.db.set("visitedIds", visitedIds);
    },
  },
  async run() {
    const visitedIds = this._getVisitedIds();

    const response = await this.drata.listMonitors({
      paginate: true,
      params: {
        checkResultStatus: "FAILED",
        reportInterval: "WEEKLY",
      },
    });

    for (const monitor of response.data) {
      const id = monitor.id;
      const ts = Date.parse(monitor.lastCheck);

      if (!visitedIds[id] || ts > visitedIds[id]) {
        visitedIds[id] = ts;

        this.$emit(monitor, {
          id: `${monitor.id}_${ts}`,
          summary: `Failed: ${monitor.name}`,
          ts,
        });
      }
    }

    this._setVisitedIds(visitedIds);
  },
};
