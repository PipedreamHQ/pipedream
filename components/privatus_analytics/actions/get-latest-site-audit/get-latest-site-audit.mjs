import app from "../../privatus_analytics.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "privatus_analytics-get-latest-site-audit",
  name: "Get Latest Site Audit",
  description: "Gets the latest finished SEO audit of a site: its score, the pages crawled and the issues found and fixed. [See the documentation](https://privatusanalytics.com/docs/api)",
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
  },
  async run({ $ }) {
    const response = await this.app.request({
      $,
      method: "GET",
      path: `/sites/${utils.segment(this.siteId)}/audit/history.json`,
      params: utils.compact({
        status: "complete",
        per_page: 1,
      }),
    });
    const audit = (response || [])[0] || null;
    $.export("$summary", audit
      ? "`Successfully retrieved the latest site audit`"
      : "`No finished site audit yet`");
    return audit;
  },
};
