import app from "../../privatus_analytics.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "privatus_analytics-find-goals",
  name: "Find Goals",
  description: "Lists the goals of a site, or finds one by name, with its completions for a period. [See the documentation](https://privatusanalytics.com/docs/api)",
  version: "0.0.1",
  type: "action",
  annotations: {
    "destructiveHint": false,
    "openWorldHint": false,
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
    name: {
      type: "string",
      label: "Name",
      description: "Only goals with this name, not case sensitive.",
      optional: true,
    },
    period: {
      propDefinition: [
        app,
        "period",
      ],
      optional: true,
    },
    from: {
      propDefinition: [
        app,
        "from",
      ],
    },
    to: {
      propDefinition: [
        app,
        "to",
      ],
    },
    status: {
      type: "string",
      label: "Status",
      description: "active (default), archived or all.",
      options: [
        "active",
        "archived",
        "all",
      ],
      default: "active",
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
      path: `/sites/${utils.segment(this.siteId)}/goals.json`,
      params: utils.compact({
        period: this.period,
        from: this.period === "custom"
          ? utils.toDate(this.from)
          : undefined,
        to: this.period === "custom"
          ? utils.toDate(this.to)
          : undefined,
        status: this.status,
      }),
      maxResults: Infinity,
    });
    const wanted = (this.name || "").trim().toLowerCase();
    if (wanted) items = items.filter((goal) => String(goal.name).toLowerCase() === wanted);
    items = items.slice(0, this.maxResults);
    $.export("$summary", `Found ${items.length} goal${items.length === 1
      ? ""
      : "s"}`);
    return items;
  },
};
