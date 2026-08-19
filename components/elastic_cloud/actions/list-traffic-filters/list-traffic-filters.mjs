// x-pd-ai: optimized
import elasticCloud from "../../elastic_cloud.app.mjs";

export default {
  key: "elastic_cloud-list-traffic-filters",
  name: "List Traffic Filter Rulesets",
  description: "List all traffic filter rulesets in your Elastic Cloud organization. Use this first to discover ruleset IDs before calling **Update Traffic Filter Ruleset** or **Delete Traffic Filter Ruleset**. [See the documentation](https://www.elastic.co/docs/api/doc/cloud/operation/operation-get-traffic-filter-rulesets)",
  version: "0.0.1",
  type: "action",
  props: {
    elasticCloud,
  },
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  async run({ $ }) {
    const response = await this.elasticCloud.listTrafficFilters({
      $,
    });
    $.export("$summary", `Successfully retrieved ${response.rulesets?.length ?? 0} traffic filter ruleset(s)`);
    return response;
  },
};
