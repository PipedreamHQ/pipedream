import app from "../../privatus_analytics.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "privatus_analytics-find-status-pages",
  name: "Find Status Pages",
  description: "Lists the status pages of the workspace, or finds one by name or slug. Use it to get the status page ID for **Post Status Page Update**. [See the documentation](https://privatusanalytics.com/docs/api)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    "destructiveHint": false,
    "openWorldHint": true,
    "readOnlyHint": true,
  },
  props: {
    app,
    query: {
      type: "string",
      label: "Name or Slug",
      description: "Part of the name or slug of the status page, e.g. `acme`.",
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
    let items = await this.app.paginate({
      $,
      path: await this.app.workspacePath({
        $,
        path: "/status_pages.json",
      }),
      params: utils.compact({
        query: this.query,
      }),
      maxResults: this.maxResults,
    });
    $.export("$summary", `Found ${items.length} status page${items.length === 1
      ? ""
      : "s"}`);
    return items;
  },
};
