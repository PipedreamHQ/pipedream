import app from "../../privatus_analytics.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "privatus_analytics-find-uptime-checks",
  name: "Find Uptime Checks",
  description: "Lists the uptime checks of a site, or finds one by name or URL, with its status and uptime. [See the documentation](https://privatusanalytics.com/docs/api)",
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
    siteId: {
      propDefinition: [
        app,
        "siteId",
      ],
    },
    query: {
      type: "string",
      label: "Name or URL",
      description: "Case insensitive text matched against name, url and host.",
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "Only checks in this state: up, down, pending (no result yet) or paused.",
      options: [
        "up",
        "down",
        "pending",
        "paused",
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
    let items = await this.app.paginate({
      $,
      path: `/sites/${utils.segment(this.siteId)}/uptime.json`,
      params: utils.compact({
        query: this.query,
        status: this.status,
      }),
      maxResults: this.maxResults,
    });
    $.export("$summary", `Found ${items.length} uptime check${items.length === 1
      ? ""
      : "s"}`);
    return items;
  },
};
