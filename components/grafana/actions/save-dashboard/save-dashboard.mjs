// vandelay-test-dr
import grafana from "../../grafana.app.mjs";

export default {
  key: "grafana-save-dashboard",
  name: "Save Dashboard",
  description:
    "Create or update a Grafana dashboard. This is an upsert"
    + " operation — if the dashboard UID exists, it updates;"
    + " otherwise it creates."
    + " Use **Get Dashboard** to retrieve an existing dashboard"
    + " model before modifying it."
    + " Use **List Folders** to find the target folder UID."
    + " Pass `overwrite: true` to force-save over version"
    + " conflicts."
    + " [See the documentation](https://grafana.com/docs/"
    + "grafana/latest/developers/http_api/dashboard/)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    grafana,
    dashboard: {
      type: "string",
      label: "Dashboard Model",
      description:
        "JSON dashboard model. Use **Get Dashboard** to retrieve"
        + " an existing model, modify it, and pass it back."
        + " For a new dashboard, provide at minimum:"
        + " `{\"title\": \"My Dashboard\", \"panels\": []}`."
        + " Set `\"uid\": null` or omit it to auto-generate a"
        + " new UID.",
    },
    folderUid: {
      type: "string",
      label: "Folder UID",
      description:
        "Folder UID to save the dashboard into. Use **List"
        + " Folders** to discover available folders.",
      optional: true,
    },
    message: {
      type: "string",
      label: "Commit Message",
      description:
        "Version commit message for the dashboard change.",
      optional: true,
    },
    overwrite: {
      type: "boolean",
      label: "Overwrite",
      description:
        "Overwrite existing dashboard if UID matches, even with"
        + " version conflicts. Default: `false`.",
      optional: true,
    },
  },
  async run({ $ }) {
    let dashboardModel;
    try {
      dashboardModel = typeof this.dashboard === "string"
        ? JSON.parse(this.dashboard)
        : this.dashboard;
    } catch {
      throw new Error(
        "dashboard must be valid JSON. Example:"
        + " {\"title\": \"My Dashboard\", \"panels\": []}",
      );
    }

    const data = {
      dashboard: dashboardModel,
    };

    if (this.folderUid) data.folderUid = this.folderUid;
    if (this.message) data.message = this.message;
    if (this.overwrite != null) data.overwrite = this.overwrite;

    const response = await this.grafana.saveDashboard($, data);

    const title = dashboardModel.title || "Unknown";
    const status = response?.status || "success";

    $.export(
      "$summary",
      `Dashboard "${title}" saved (${status})`,
    );

    return response;
  },
};
