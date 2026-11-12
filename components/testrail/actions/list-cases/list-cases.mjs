import app from "../../testrail.app.mjs";
import utils from "../../common/utils.mjs";

const DEFAULT_FIELDS = [
  "title",
  "section_id",
  "suite_id",
  "priority_id",
];
const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 1000;

export default {
  key: "testrail-list-cases",
  name: "List Cases",
  description: "Search and list the test cases of a TestRail project: by title text, section, priority, type or last-updated date. Follows TestRail's pagination for you and counts every match (up to 1000): `total` is the full match count, `cases` holds the first `limit` (default 50, max 1000) of them."
    + " Use to check for duplicates before **Add Case** (`search`), to find a case's id, or to count cases in a section. Get `projectId` from **List Projects** and `sectionId` from **List Sections**."
    + " Multi-suite projects: leave `suiteId` empty and every suite is searched (each case carries its `suite_id`); TestRail itself would reject the request without one."
    + " `search` matches the case title (substring, case-insensitive). Returns `{ total, returned, truncated, cases }` (`truncated` = more than 1000 matches); to just count, pass limit=1; to see more of the list raise `limit` or narrow with `search`/`sectionId`. Compact default fields; pass `fields` for others (`id` is always included; e.g. custom_steps_separated, custom_preconds, estimate, created_on). Always pass `fields` when you only need ids and titles."
    + " Example: projectId=12, search=\"raptor\" → returns `{ total: 2, returned: 2, cases: [{ id: 801, title: \"Raptor paddock gate lock engages\", section_id: 73, suite_id: 15, priority_id: 2 }, ...] }`."
    + " Case ids are different from test ids (tests exist per run; see **List Tests**)."
    + " [See the documentation](https://support.testrail.com/hc/en-us/articles/7077292642580-Cases)",
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
    projectId: {
      propDefinition: [
        app,
        "projectId",
      ],
    },
    suiteId: {
      propDefinition: [
        app,
        "suiteId",
      ],
    },
    sectionId: {
      propDefinition: [
        app,
        "sectionId",
      ],
      optional: true,
    },
    search: {
      type: "string",
      label: "Title Contains",
      description: "Only cases whose title contains this text, e.g. `login`.",
      optional: true,
    },
    priorityIds: {
      type: "string[]",
      label: "Priority IDs",
      description: "Only cases with these priority ids. Use **Get Metadata** (`priorities`) to map names to ids.",
      optional: true,
    },
    typeIds: {
      type: "string[]",
      label: "Type IDs",
      description: "Only cases with these case type ids. Use **Get Metadata** (`caseTypes`) to map names to ids.",
      optional: true,
    },
    updatedAfter: {
      type: "string",
      label: "Updated After",
      description: "Only cases updated after this time. ISO 8601 (`2026-11-01`) or unix seconds.",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: `How many matching cases to include in the response (default ${DEFAULT_LIMIT}, max ${MAX_LIMIT}). \`total\` always counts all matches, so use limit=1 to count.`,
      optional: true,
      min: 1,
      max: MAX_LIMIT,
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description: `Case fields to return (\`id\` is always included). Default: ${DEFAULT_FIELDS.join(", ")}.`,
      optional: true,
    },
  },
  async run({ $ }) {
    const limit = Math.min(this.limit || DEFAULT_LIMIT, MAX_LIMIT);
    let { suiteId } = this;
    if (this.sectionId && !suiteId) {
      // A section belongs to exactly one suite, so look it up instead of searching them all.
      ({ suite_id: suiteId } = await this.app._makeRequest({
        endpoint: `get_section/${this.sectionId}`,
      }));
    }
    const suiteIds = await this.app.resolveSuiteIds(this.projectId, suiteId);
    const {
      items, truncated,
    } = await this.app.collectAcrossSuites(
      suiteIds,
      (id) => this.app.paginate({
        endpoint: `get_cases/${this.projectId}`,
        params: {
          suite_id: id,
          section_id: this.sectionId,
          filter: this.search,
          priority_id: utils.csv(this.priorityIds),
          type_id: utils.csv(this.typeIds),
          updated_after: utils.toUnixSeconds(this.updatedAfter),
        },
        key: "cases",
        limit: MAX_LIMIT,
      }),
    );
    const fields = this.fields?.length
      ? this.fields
      : DEFAULT_FIELDS;
    const total = Math.min(items.length, MAX_LIMIT);
    const cases = items.slice(0, limit).map((c) => utils.pluck(c, fields));
    $.export("$summary", `Found ${total} case${total === 1
      ? ""
      : "s"}, returning ${cases.length}`);
    return {
      total,
      returned: cases.length,
      truncated: truncated || items.length > MAX_LIMIT,
      cases,
    };
  },
};
