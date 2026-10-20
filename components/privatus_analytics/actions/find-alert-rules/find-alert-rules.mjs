import app from "../../privatus_analytics.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "privatus_analytics-find-alert-rules",
  name: "Find Alert Rules",
  description: "Lists the alert rules of the workspace, or finds one by name, with its state (ok or triggered). [See the documentation](https://privatusanalytics.com/docs/api)",
  version: "0.0.1",
  type: "action",
  annotations: {
    "destructiveHint": false,
    "openWorldHint": false,
    "readOnlyHint": true,
  },
  props: {
    app,
    name: {
      type: "string",
      label: "Name",
      description: "Part of the rule name, not case sensitive.",
      optional: true,
    },
    siteId: {
      propDefinition: [
        app,
        "siteId",
      ],
      optional: true,
    },
    state: {
      type: "string",
      label: "State",
      description: "Only alerts in this state: ok or triggered (an incident is open).",
      options: [
        "ok",
        "triggered",
      ],
      optional: true,
    },
    kind: {
      type: "string",
      label: "Kind",
      description: "Only this kind: threshold, anomaly, goal, new_referrer, no_data, usage, uptime, ssl, vitals, subscriptions or testimonials.",
      options: [
        "threshold",
        "anomaly",
        "goal",
        "new_referrer",
        "no_data",
        "usage",
        "uptime",
        "ssl",
        "vitals",
        "subscriptions",
        "testimonials",
      ],
      optional: true,
    },
    maxResults: {
      propDefinition: [
        app,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const workspaceId = await this.app.getWorkspaceId({
      $,
    });
    let items = await this.app.paginate({
      $,
      path: `/workspaces/${workspaceId}/alerts.json`,
      params: utils.compact({
        site_id: this.siteId,
        state: this.state,
        kind: this.kind,
      }),
      maxResults: Infinity,
    });
    const wanted = (this.name || "").trim().toLowerCase();
    if (wanted) items = items.filter((alert) => String(alert.name).toLowerCase()
      .includes(wanted));
    items = items.slice(0, this.maxResults);
    $.export("$summary", `Found ${items.length} alert rule${items.length === 1
      ? ""
      : "s"}`);
    return items;
  },
};
