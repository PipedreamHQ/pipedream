import app from "../../court_rules.app.mjs";

export default {
  key: "court_rules-get-judge-rules",
  name: "Get Judge Rules",
  description: "Get every rule that applies to one judge: the court-wide rules plus the judge's own standing orders and individual practices, each with its source quote. For `edny` the rules are grouped into FRCP, local rules and standing order layers and can be narrowed with Document Scope and Motion Type; for other courts they are grouped into court-wide rules and the judge's own rules. Use **List Courts** and **List Judges** first to find the court ID and judge slug. Use **Search Filing Rules** instead to search by topic across a whole court. [See the documentation](https://docs.courtrules.app/api-reference/rules)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    districtId: {
      propDefinition: [
        app,
        "districtId",
      ],
    },
    judgeSlug: {
      propDefinition: [
        app,
        "judgeSlug",
        ({ districtId }) => ({
          districtId,
        }),
      ],
    },
    documentScope: {
      propDefinition: [
        app,
        "documentScope",
      ],
      description: "Only return rules relevant to this type of document, e.g. `brief_support`. Applies only to courts with compliance profiles (currently `edny`) and is ignored for other courts.",
      optional: true,
    },
    motionType: {
      propDefinition: [
        app,
        "motionType",
      ],
      description: "Only return rules relevant to this kind of motion, e.g. `Rule_56` for summary judgment. Applies only to courts with compliance profiles (currently `edny`) and is ignored for other courts.",
    },
  },
  async run({ $ }) {
    const response = await this.app.getRules({
      $,
      params: {
        district_id: this.districtId,
        judge_slug: this.judgeSlug,
        document_scope: this.documentScope,
        motion_type: this.motionType,
      },
    });

    $.export("$summary", `Retrieved ${response.meta?.total_rules ?? 0} rule(s) for ${response.judge?.name ?? this.judgeSlug}`);

    return response;
  },
};
