// x-pd-ai: optimized
import elasticSecurity from "../../elastic_security.app.mjs";
import { pickFields } from "../../common/utils.mjs";

export default {
  key: "elastic_security-find-detection-rules",
  name: "Find Detection Rules",
  description: "Find and list Elastic Security detection rules via GET /api/detection_engine/rules/_find, or fetch a single rule directly via GET /api/detection_engine/rules when `id` or `ruleId` is provided."
    + " Use this to search/browse rules, or to look up one rule's full definition once you have an ID."
    + " Run this first to obtain an `id`/`ruleId` before using **Create or Update Detection Rule**, **Run Detection Rule**, or **Delete Record**."
    + " Example: calling with `filter: 'alert.attributes.enabled: true'` returns `{ total: 3, data: [{ id: \"7ac3...\", name: \"InGen Perimeter Query Rule\", type: \"query\", enabled: true, ... }] }`; use `fields` to shrink each rule down to just the fields you need — rule objects carry many advanced fields (`exceptions_list`, `related_integrations`, `threat`, etc.) that are rarely relevant."
    + " [See the documentation](https://www.elastic.co/docs/api/doc/kibana/operation/operation-findrules)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    elasticSecurity,
    id: {
      propDefinition: [
        elasticSecurity,
        "id",
      ],
      description: "Fetch a single rule directly by its Kibana internal UUID instead of searching. Provide either this or `ruleId`, not both. When set, all filter/sort/pagination parameters are ignored.",
      optional: true,
    },
    ruleId: {
      propDefinition: [
        elasticSecurity,
        "ruleId",
      ],
      description: "Fetch a single rule directly by its user-defined `rule_id` instead of searching. Provide either this or `id`, not both. When set, all filter/sort/pagination parameters are ignored.",
      optional: true,
    },
    filter: {
      type: "string",
      label: "Filter",
      description: "KQL/Lucene filter over rule attributes using the `alert.attributes.<field>` syntax (e.g. `alert.attributes.name: \"My Rule\"` or `alert.attributes.enabled: true`). Ignored when `id`/`ruleId` is provided.",
      optional: true,
    },
    sortField: {
      propDefinition: [
        elasticSecurity,
        "sortField",
      ],
      description: "Field to sort by. One of: `created_at`, `createdAt`, `enabled`, `name`, `risk_score`, `riskScore`, `severity`, `updated_at`, `updatedAt`. Ignored when `id`/`ruleId` is provided.",
    },
    sortOrder: {
      propDefinition: [
        elasticSecurity,
        "sortOrder",
      ],
      description: "Sort direction: `asc` or `desc`. Ignored when `id`/`ruleId` is provided.",
    },
    page: {
      propDefinition: [
        elasticSecurity,
        "page",
      ],
    },
    perPage: {
      propDefinition: [
        elasticSecurity,
        "perPage",
      ],
    },
    fields: {
      propDefinition: [
        elasticSecurity,
        "fields",
      ],
      description: "Only include these fields in each returned rule, to reduce response size. Omit to return the full rule object(s)."
        + " Common fields: `id`, `rule_id`, `name`, `description`, `type`, `enabled`, `risk_score`, `severity`, `tags`, `query`, `index`, `interval`, `created_at`, `updated_at`.",
    },
  },
  async run({ $ }) {
    if (this.id || this.ruleId) {
      const response = await this.elasticSecurity.getDetectionRule({
        $,
        params: {
          id: this.id,
          rule_id: this.ruleId,
        },
      });
      $.export("$summary", `Retrieved detection rule "${response.name}" (${response.id})`);
      return pickFields(response, this.fields);
    }
    const response = await this.elasticSecurity.findDetectionRules({
      $,
      params: {
        filter: this.filter,
        sort_field: this.sortField,
        sort_order: this.sortOrder,
        page: this.page,
        per_page: this.perPage,
      },
    });
    $.export("$summary", `Found ${response.total} detection rule(s)`);
    if (this.fields?.length) {
      return {
        ...response,
        data: response.data.map((rule) => pickFields(rule, this.fields)),
      };
    }
    return response;
  },
};
