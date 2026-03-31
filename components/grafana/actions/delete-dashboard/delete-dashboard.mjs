// vandelay-test-dr
import grafana from "../../grafana.app.mjs";

export default {
  key: "grafana-delete-dashboard",
  name: "Delete Dashboard",
  description:
    "Permanently delete a Grafana dashboard by UID."
    + " This cannot be undone."
    + " Use **Search Dashboards** to find the dashboard UID.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    grafana,
    uid: {
      type: "string",
      label: "Dashboard UID",
      description:
        "The UID of the dashboard to delete. Use **Search"
        + " Dashboards** to find it.",
    },
  },
  async run({ $ }) {
    const response = await this.grafana.deleteDashboard($, this.uid);

    $.export(
      "$summary",
      `Deleted dashboard ${this.uid}`,
    );

    return response;
  },
};
