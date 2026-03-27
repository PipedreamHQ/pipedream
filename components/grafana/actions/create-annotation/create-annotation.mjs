// vandelay-test-dr
import grafana from "../../grafana.app.mjs";

export default {
  key: "grafana-create-annotation",
  name: "Create Annotation",
  description:
    "Create an annotation on a dashboard or globally."
    + " Annotations mark events like deployments, incidents, or"
    + " configuration changes on dashboard timelines."
    + " Use **Search Dashboards** to find the dashboard UID."
    + " Omit `dashboardUid` for a global annotation visible on"
    + " all dashboards."
    + " Use `time` and `timeEnd` for range annotations (e.g.,"
    + " deployment window).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    grafana,
    text: {
      type: "string",
      label: "Text",
      description: "Annotation text/description.",
    },
    dashboardUid: {
      type: "string",
      label: "Dashboard UID",
      description:
        "Dashboard to annotate. Omit for a global annotation"
        + " visible on all dashboards. Use **Search Dashboards**"
        + " to find the UID.",
      optional: true,
    },
    panelId: {
      type: "integer",
      label: "Panel ID",
      description:
        "Specific panel within the dashboard to annotate.",
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Tags for filtering annotations.",
      optional: true,
    },
    time: {
      type: "integer",
      label: "Start Time",
      description:
        "Start time as epoch milliseconds. Default: now.",
      optional: true,
    },
    timeEnd: {
      type: "integer",
      label: "End Time",
      description:
        "End time as epoch milliseconds for range annotations."
        + " Omit for a point-in-time annotation.",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      text: this.text,
    };

    if (this.dashboardUid) data.dashboardUID = this.dashboardUid;
    if (this.panelId) data.panelId = this.panelId;
    if (this.tags?.length) data.tags = this.tags;
    if (this.time) data.time = this.time;
    if (this.timeEnd) data.timeEnd = this.timeEnd;

    const response = await this.grafana.createAnnotation($, data);

    const id = response?.id || "unknown";

    $.export(
      "$summary",
      `Created annotation (ID: ${id})${
        this.dashboardUid
          ? ` on dashboard ${this.dashboardUid}`
          : " (global)"}`,
    );

    return response;
  },
};
