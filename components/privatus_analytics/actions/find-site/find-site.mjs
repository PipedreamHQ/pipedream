import app from "../../privatus_analytics.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "privatus_analytics-find-site",
  name: "Find Site",
  description: "Finds a site by its main domain or an extra domain. [See the documentation](https://privatusanalytics.com/docs/api)",
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
    domain: {
      type: "string",
      label: "Domain",
      description: "Like `example.com`. A full address works too.",
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
        path: "/sites.json",
      }),
      params: utils.compact({
        query: utils.normalizeDomain(this.domain),
      }),
      maxResults: Infinity,
    });
    const domain = utils.normalizeDomain(this.domain);
    items = items.filter((site) => utils.normalizeDomain(site.domain) === domain
      || (site.extra_domains || []).map(utils.normalizeDomain).includes(domain));
    items = items.slice(0, this.maxResults);
    $.export("$summary", `Found ${items.length} matching site${items.length === 1
      ? ""
      : "s"}`);
    return items;
  },
};
