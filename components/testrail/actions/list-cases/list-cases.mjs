import app from "../../testrail.app.mjs";
import {
  pluck, toPage,
} from "../../common/utils.mjs";

const DEFAULT_FIELDS = [
  "title",
  "section_id",
  "suite_id",
  "priority_id",
  "type_id",
  "refs",
  "updated_on",
];

export default {
  key: "testrail-list-cases",
  name: "List Cases",
  description: "Search or list test cases in a TestRail project (ids are per-instance: if you only have names, resolve them first with **List Projects**, **List Suites** and **List Sections** — never guess ids), filtered by suite, section, title text, type or priority. Use it to find existing cases and to check for duplicates before **Create Case**. In multi-suite projects (`suite_mode` 3 in **List Projects**) `suiteId` is REQUIRED (from **List Suites**); `sectionId` comes from **List Sections**. `filter` is a case-insensitive title substring. Returns a compact set of fields by default (id, title, section_id, suite_id, priority_id, type_id, refs, updated_on); pass `fields` (e.g. `custom_steps_separated`) for more, or call **Get Case** for one full case. Results are paged: a page holds at most `limit` cases (default 100) — when `next_offset` is not null there are more, call again with `offset`; to COUNT cases keep paging until it is null. Example: projectId=412, suiteId=8731, filter=\"fence\" → [{id: 301, title: \"Verify paddock fence voltage alarm\", section_id: 410}]. [See the documentation](https://support.testrail.com/hc/en-us/articles/7077292642580-Cases)",
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
      type: "integer",
      label: "Section ID",
      description: "Only cases in this section. Use **List Sections** to find it.",
      optional: true,
    },
    filter: {
      type: "string",
      label: "Title Filter",
      description: "Case-insensitive text the case title must contain, e.g. `fence`.",
      optional: true,
    },
    typeIds: {
      type: "integer[]",
      label: "Case Type IDs",
      description: "Only cases of these types. See **List Metadata** (kind=case_types).",
      optional: true,
    },
    priorityIds: {
      type: "integer[]",
      label: "Priority IDs",
      description: "Only cases with these priorities. See **List Metadata** (kind=priorities).",
      optional: true,
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description: `Fields to return per case (\`id\` is always included). Default: ${DEFAULT_FIELDS.join(", ")}. Ask only for what you need, e.g. ["title"] for a titles-only list.`,
      optional: true,
    },
    limit: {
      propDefinition: [
        app,
        "limit",
      ],
    },
    offset: {
      propDefinition: [
        app,
        "offset",
      ],
    },
  },
  async run({ $ }) {
    const limit = this.limit ?? 100;
    const response = await this.app.getCases({
      $,
      projectId: this.projectId,
      params: {
        suite_id: this.suiteId,
        section_id: this.sectionId,
        filter: this.filter,
        type_id: this.typeIds?.length
          ? this.typeIds
          : undefined,
        priority_id: this.priorityIds?.length
          ? this.priorityIds
          : undefined,
        limit,
        offset: this.offset,
      },
    });
    const page = toPage(response, "cases", {
      offset: this.offset ?? 0,
      limit,
    });
    const fields = this.fields?.length
      ? this.fields
      : DEFAULT_FIELDS;
    page.cases = page.cases.map((c) => pluck(c, fields));
    $.export("$summary", `Found ${page.count} case(s)${page.next_offset === null
      ? ""
      : " (more available, see next_offset)"}`);
    return page;
  },
};
