// x-pd-ai: optimized
import { ConfigurationError } from "@pipedream/platform";
import elasticCloud from "../../elastic_cloud.app.mjs";

export default {
  key: "elastic_cloud-update-traffic-filter",
  name: "Update Traffic Filter Ruleset",
  description: "Update an existing traffic filter ruleset in Elastic Cloud. The underlying API replaces the whole ruleset, so this action first reads the current ruleset and merges your changes over it — supply only the fields you want to change. The ruleset's `type` and `region` are immutable after creation and are carried over automatically. Run **List Traffic Filter Rulesets** first to find the ruleset ID. [See the documentation](https://www.elastic.co/docs/api/doc/cloud/operation/operation-update-traffic-filter-ruleset)",
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
      description: "Optional JSON array of rule objects that **replaces** every rule currently in the ruleset — include the existing rules you want to keep. Omit this prop to leave the current rules untouched. Example: `[{\"source\":\"1.2.3.4/32\"}]`",
      optional: true,
    },
  },
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  async run({ $ }) {
    if (!this.name && !this.description && this.includeByDefault === undefined && !this.rules) {
      throw new ConfigurationError("Set at least one field to update: Name, Description, Include By Default, or Rules.");
    }
    // The API replaces the entire ruleset on update, so merge over the current one
    const current = await this.elasticCloud.getTrafficFilter({
      $,
      rulesetId: this.rulesetId,
    });
    const response = await this.elasticCloud.updateTrafficFilter({
      $,
      rulesetId: this.rulesetId,
      data: {
        // type and region are immutable after creation
        type: current.type,
        region: current.region,
        name: this.name ?? current.name,
        description: this.description ?? current.description,
        include_by_default: this.includeByDefault ?? current.include_by_default,
        rules: this.rules
          ? JSON.parse(this.rules)
          : current.rules,
      },
    });
    $.export("$summary", `Successfully updated traffic filter ruleset ${this.rulesetId}`);
    return response;
  },
};
