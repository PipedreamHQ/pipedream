import elasticCloud from "../../elastic_cloud.app.mjs";
import { TRAFFIC_FILTER_TYPES } from "../../common/constants.mjs";

export default {
  key: "elastic_cloud-create-traffic-filter",
  name: "Create Traffic Filter Ruleset",
  description: "Create a new traffic filter ruleset in Elastic Cloud. The API requires a name, type, region, rules, and include-by-default flag. Note that `type` and `region` cannot be changed after the ruleset is created. [See the documentation](https://www.elastic.co/docs/api/doc/cloud/operation/operation-create-traffic-filter-ruleset)",
  version: "0.0.2",
  type: "action",
  ai: "optimized",
  props: {
    elasticCloud,
    name: {
      propDefinition: [
        elasticCloud,
        "name",
      ],
      description: "A human-readable name for the ruleset (e.g. `allow-office-ips`).",
    },
    type: {
      type: "string",
      label: "Type",
      description: `The ruleset type. One of: ${TRAFFIC_FILTER_TYPES.join(", ")}.`,
      options: TRAFFIC_FILTER_TYPES,
    },
    region: {
      propDefinition: [
        elasticCloud,
        "region",
      ],
    },
    description: {
      propDefinition: [
        elasticCloud,
        "description",
      ],
      description: "Optional description of the ruleset (e.g. `Office egress IPs`).",
      optional: true,
    },
    includeByDefault: {
      propDefinition: [
        elasticCloud,
        "includeByDefault",
      ],
      default: false,
    },
    rules: {
      propDefinition: [
        elasticCloud,
        "rules",
      ],
    },
  },
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  async run({ $ }) {
    const rules = JSON.parse(this.rules);
    const response = await this.elasticCloud.createTrafficFilter({
      $,
      data: {
        name: this.name,
        type: this.type,
        region: this.region,
        description: this.description,
        include_by_default: this.includeByDefault,
        rules,
      },
    });
    $.export("$summary", `Successfully created traffic filter ruleset ${response.id}: ${this.name}`);
    return response;
  },
};
