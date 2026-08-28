// x-pd-ai: optimized
import elasticSecurity from "../../elastic_security.app.mjs";

export default {
  key: "elastic_security-list-tags",
  name: "List Tags",
  description: "List all unique tags currently in use across Elastic Security cases via GET /api/cases/tags, or detection rules via GET /api/detection_engine/tags."
    + " Use this before tagging a case or rule so you reuse an existing tag instead of creating a near-duplicate (e.g. `incident-response` vs. `incident_response`)."
    + " Cross-referenced by the `tags` parameter on **Create or Update Case**, **Create or Update Detection Rule**, and **Find Cases**."
    + " Example: calling with `objectType: \"case\"` returns `[\"council-jurassic-eval\", \"ransomware\", \"insider-threat\"]`."
    + " [See the case tags documentation](https://www.elastic.co/docs/api/doc/kibana/operation/operation-getcasetagsdefaultspace) and the [rule tags documentation](https://www.elastic.co/docs/api/doc/kibana/operation/operation-readtags)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    elasticSecurity,
    objectType: {
      propDefinition: [
        elasticSecurity,
        "objectType",
      ],
      description: "Whether to list tags used on cases or on detection rules.",
    },
  },
  async run({ $ }) {
    if (this.objectType === "case") {
      const tags = await this.elasticSecurity.listCaseTags({
        $,
      });
      $.export("$summary", `Found ${tags.length} case tag(s)`);
      return tags;
    }
    const tags = await this.elasticSecurity.listRuleTags({
      $,
    });
    $.export("$summary", `Found ${tags.length} detection rule tag(s)`);
    return tags;
  },
};
