import app from "../../court_rules.app.mjs";
import { FILING_ROLES } from "../../common/constants.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "court_rules-check-document-compliance",
  name: "Check Document Compliance",
  description: "Check a federal court filing against the rules that apply to one judge and get a pass, fail or action-required result for each rule, with the rule citation. Send only the page count and word count for the basic checks (page and word limits, courtesy copies, pre-motion conference and filing gate rules), and add Document Details for structure checks such as caption, signature block, sections, formatting and privacy redactions. Compliance checks run for `edny` today; other courts return an error that points to **Get Judge Rules** and **Search Filing Rules**. Use **List Judges** to find the judge slug. The check is deterministic and changes nothing. [See the documentation](https://docs.courtrules.app/api-reference/check)",
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
      description: "The identifier of the court, e.g. `edny`. Compliance checks run for `edny` today. Use **List Courts** to find court IDs (the `district_id` field).",
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
    },
    filingRole: {
      type: "string",
      label: "Filing Role",
      description: "The filer's role in the motion sequence, e.g. `movant`. One of `movant`, `opponent` or `reply`.",
      options: FILING_ROLES,
    },
    pageCount: {
      type: "integer",
      label: "Page Count",
      description: "Number of body pages, not counting the table of contents, table of authorities or certificate of service, e.g. `18`.",
      min: 0,
    },
    wordCount: {
      type: "integer",
      label: "Word Count",
      description: "Total word count of the document, e.g. `7200`.",
      min: 0,
    },
    motionType: {
      propDefinition: [
        app,
        "motionType",
      ],
    },
    isProSe: {
      type: "boolean",
      label: "Filer Is Pro Se",
      description: "Whether the filing party is self-represented, e.g. `false`. Defaults to `false`.",
      default: false,
      optional: true,
    },
    pmcCompleted: {
      type: "boolean",
      label: "Pre-Motion Conference Completed",
      description: "Whether a pre-motion conference was held or waived for this motion, e.g. `true`. Defaults to `false`.",
      default: false,
      optional: true,
    },
    opposingPartyProSe: {
      type: "boolean",
      label: "Opposing Party Is Pro Se",
      description: "Whether the opposing party is self-represented, which affects Rule 56 notice requirements, e.g. `false`. Defaults to `false`.",
      default: false,
      optional: true,
    },
    documentDetails: {
      type: "object",
      label: "Document Details",
      description: "Optional structure details for the extra checks, as a JSON object with any of `caption`, `signature_block`, `sections`, `format` and `privacy`. Example: `{\"format\": {\"primary_font_size_pt\": 12, \"margin_inches\": 1, \"line_spacing\": \"double\"}}`. The fields of each part are listed at https://docs.courtrules.app/concepts/document-structure.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.checkDocument({
      $,
      data: {
        judge_slug: this.judgeSlug,
        district_id: this.districtId,
        document_scope: this.documentScope,
        motion_type: this.motionType,
        is_pro_se: this.isProSe ?? false,
        pmc_completed: this.pmcCompleted ?? false,
        opposing_party_pro_se: this.opposingPartyProSe ?? false,
        filing_role: this.filingRole,
        document: {
          ...parseObject(this.documentDetails),
          page_count: this.pageCount,
          word_count: this.wordCount,
        },
      },
    });

    const { summary } = response;
    $.export("$summary", `Checked the document against ${response.judge?.name ?? this.judgeSlug}: ${summary.status}, ${summary.failures} failure(s), ${summary.warnings} warning(s), ${summary.action_items} action item(s)`);

    return response;
  },
};
