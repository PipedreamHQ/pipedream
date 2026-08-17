// x-pd-ai: optimized
import elasticCloud from "../../elastic_cloud.app.mjs";

export default {
  key: "elastic_cloud-update-traffic-filter",
  name: "Update Traffic Filter Ruleset",
  description: "Update an existing traffic filter ruleset in Elastic Cloud. Run **List Traffic Filter Rulesets** first to find the ruleset ID. [See the documentation](https://www.elastic.co/docs/api/doc/cloud/group/endpoint-deploymentstrafficfilter)",
  version: "0.0.1",
  type: "action",
  props: {
    elasticCloud,
    rulesetId: {
      propDefinition: [
        elasticCloud,
        "rulesetId",
      ],
    },
    name: {
      propDefinition: [
        elasticCloud,
        "name",
      ],
      description: "Updated human-readable name for the ruleset.",
      optional: true,
    },
    description: {
      propDefinition: [
        elasticCloud,
        "description",
      ],
      description: "Updated description of the ruleset.",
      optional: true,
    },
    includeByDefault: {
      propDefinition: [
        elasticCloud,
        "includeByDefault",
      ],
      optional: true,
    },
    rules: {
      propDefinition: [
        elasticCloud,
        "rules",
      ],
      description: "Optional JSON array of rule objects replacing the current rules. Example: `[{\"source\":\"1.2.3.4/32\"}]`",
      optional: true,
    },
  },
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  async run({ $ }) {
    const rules = this.rules
      ? JSON.parse(this.rules)
      : undefined;
    const response = await this.elasticCloud.updateTrafficFilter({
      $,
      rulesetId: this.rulesetId,
      data: {
        name: this.name,
        description: this.description,
        include_by_default: this.includeByDefault,
        rules,
      },
    });
    $.export("$summary", `Successfully updated traffic filter ruleset ${this.rulesetId}`);
    return response;
  },
};
