import elasticCloud from "../../elastic_cloud.app.mjs";

export default {
  key: "elastic_cloud-delete-traffic-filter",
  name: "Delete Traffic Filter Ruleset",
  description: "Permanently delete a traffic filter ruleset from Elastic Cloud. This is irreversible. Run **List Traffic Filter Rulesets** first to find the ruleset ID. [See the documentation](https://www.elastic.co/docs/api/doc/cloud/operation/operation-delete-traffic-filter-ruleset)",
  version: "0.0.2",
  type: "action",
  ai: "optimized",
  props: {
    elasticCloud,
    rulesetId: {
      propDefinition: [
        elasticCloud,
        "rulesetId",
      ],
    },
  },
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
    openWorldHint: true,
  },
  async run({ $ }) {
    const response = await this.elasticCloud.deleteTrafficFilter({
      $,
      rulesetId: this.rulesetId,
    });
    $.export("$summary", `Successfully deleted traffic filter ruleset ${this.rulesetId}`);
    return response;
  },
};
