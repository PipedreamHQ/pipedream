import app from "../../privatus_analytics.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "privatus_analytics-create-workspace-chart-note",
  name: "Create Workspace Chart Note",
  description: "Adds a note to the charts of every site in the workspace, such as a release that touched them all. [See the documentation](https://privatusanalytics.com/docs/api)",
  version: "0.0.1",
  type: "action",
  annotations: {
    "destructiveHint": false,
    "openWorldHint": false,
    "readOnlyHint": false,
  },
  props: {
    app,
    title: {
      type: "string",
      label: "Title",
      description: "Short title shown on the chart.",
    },
    date: {
      type: "string",
      label: "Date",
      description: "The day the note is shown on, as `YYYY-MM-DD`. Defaults to today.",
      optional: true,
    },
    endDate: {
      type: "string",
      label: "End Date",
      description: "For a note that covers several days, the last day, as `YYYY-MM-DD`.",
      optional: true,
    },
    body: {
      type: "string",
      label: "Body",
      description: "Longer details as plain text.",
      optional: true,
    },
    url: {
      type: "string",
      label: "Link",
      description: "A link such as a pull request or changelog page.",
      optional: true,
    },
    color: {
      type: "string",
      label: "Color",
      description: "Pin color, one of neutral, brand, blue, amber, red or violet. Defaults to neutral (blue for deploy notes).",
      options: [
        "neutral",
        "brand",
        "blue",
        "amber",
        "red",
        "violet",
      ],
      optional: true,
    },
    source: {
      type: "string",
      label: "Source",
      description: "manual (default) for notes written by a person, or deploy for release notifications. system, import and incident are reserved for notes the app writes itself.",
      options: [
        "manual",
        "deploy",
        "system",
        "import",
        "incident",
      ],
      default: "manual",
      optional: true,
    },
    version: {
      type: "string",
      label: "Version",
      description: "Only used when source is deploy and title is empty. A release version or commit, used to build the default title.",
      optional: true,
    },
  },
  async run({ $ }) {
    const workspaceId = await this.app.getWorkspaceId({
      $,
    });
    const response = await this.app.request({
      $,
      method: "POST",
      path: `/workspaces/${workspaceId}/notes.json`,
      data: utils.compact({
        title: this.title,
        date: utils.toDate(this.date) ?? new Date().toISOString()
          .slice(0, 10),
        end_date: utils.toDate(this.endDate),
        body: this.body,
        url: this.url,
        color: this.color,
        source: this.source,
        version: this.version,
      }),
    });
    $.export("$summary", `Successfully created chart note '${response.title}'`);
    return response;
  },
};
