// vandelay-test-dr
import grafana from "../../grafana.app.mjs";

export default {
  key: "grafana-get-dashboard",
  name: "Get Dashboard",
  description:
    "Get the full dashboard model by UID, including all panels,"
    + " their queries, variables, and configuration."
    + " Use **Search Dashboards** first to find the dashboard"
    + " UID."
    + " The returned model can be modified and saved back with"
    + " **Save Dashboard**.",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    grafana,
    uid: {
      type: "string",
      label: "Dashboard UID",
      description:
        "The dashboard UID. Use **Search Dashboards** to find"
        + " it.",
    },
  },
  async run({ $ }) {
    const response = await this.grafana.getDashboard($, this.uid);

    const title = response?.dashboard?.title || this.uid;
    const panelCount = response?.dashboard?.panels?.length || 0;

    $.export(
      "$summary",
      `Retrieved dashboard "${title}" (${panelCount} panel${
        panelCount === 1
          ? ""
          : "s"})`,
    );

    return response;
  },
};
