import app from "../../court_rules.app.mjs";
import {
  CASE_TYPES, LOGIC_TYPES, WORKFLOW_PHASES,
} from "../../common/constants.mjs";

export default {
  key: "court_rules-search-filing-rules",
  name: "Search Filing Rules",
  description: "Search validated filing rules extracted from courts' own published rules and standing orders: e-filing, service, fees, timing, courtesy copies, page and word limits, and courtroom preferences. Each rule has a plain-English summary, the verbatim source text, a citation and the URL of the official source. Narrow the search with Court ID, Judge Slug, Rule Type or Case Type, because a search that is too broad is rejected. Use **List Courts** and **List Judges** to find the IDs, and **Get Judge Rules** to read everything that applies to one judge. Results are paged: pass the `next_offset` value from the response `meta` as Offset to read the next page. [See the documentation](https://docs.courtrules.app/api-reference/extracted-rules)",
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
      optional: true,
    },
    judgeSlug: {
      propDefinition: [
        app,
        "judgeSlug",
        ({ districtId }) => ({
          districtId,
        }),
      ],
      description: "The slug of a judge, calendar, department or courtroom, e.g. `il-cook-reilly-eve-m`, or `court` for court-wide rules only. Use **List Judges** with the same court ID to find it (the `slug` field). Requires Court ID.",
      optional: true,
    },
    query: {
      type: "string",
      label: "Query",
      description: "Words to look for in rule summaries, source text and tags, e.g. `courtesy copy` or `rejected filing cure`. Between 1 and 200 characters.",
      optional: true,
    },
    logicType: {
      type: "string",
      label: "Rule Type",
      description: "Only return rules of this type, e.g. `CourtesyCopyRule` for courtesy copy requirements or `PageWordLimitRule` for page and word limits.",
      options: LOGIC_TYPES,
      optional: true,
    },
    workflowPhase: {
      type: "string",
      label: "Workflow Phase",
      description: "Only return rules for this phase of a case, e.g. `MOTION_PRACTICE`. The phases are `FILING`, `CASE_INITIATION`, `MOTION_PRACTICE`, `TRIAL_PREP` and `POST_JUDGMENT`.",
      options: WORKFLOW_PHASES,
      optional: true,
    },
    caseType: {
      type: "string",
      label: "Case Type",
      description: "Only return rules that apply to this case type, e.g. `civil`. Rules that name no case type are included.",
      options: CASE_TYPES,
      optional: true,
    },
    includeCourtRules: {
      type: "boolean",
      label: "Include Court-Wide Rules",
      description: "When a judge slug is given, also return the court-wide rules that apply in every courtroom, e.g. `true`. Defaults to `true`.",
      default: true,
      optional: true,
    },
    limit: {
      propDefinition: [
        app,
        "limit",
      ],
    },
    offset: {
      type: "integer",
      label: "Offset",
      description: "Number of matching rules to skip, e.g. `100`. Use the `next_offset` value from the previous response `meta` to read the next page.",
      min: 0,
      default: 0,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.listExtractedRules({
      $,
      params: {
        district_id: this.districtId,
        judge_slug: this.judgeSlug,
        include_court_rules: this.includeCourtRules,
        logic_type: this.logicType,
        workflow_phase: this.workflowPhase,
        case_type: this.caseType,
        q: this.query,
        limit: this.limit,
        offset: this.offset,
      },
    });

    const total = response.meta?.total ?? response.rules.length;
    $.export("$summary", `Found ${total} matching rule(s), returned ${response.rules.length}`);

    return response;
  },
};
