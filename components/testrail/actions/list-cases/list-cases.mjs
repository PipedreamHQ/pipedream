import app from "../../testrail.app.mjs";
import {
  joinIds, pluck,
} from "../../common/utils.mjs";

const DEFAULT_FIELDS = [
  "title",
  "section_id",
  "suite_id",
  "priority_id",
  "type_id",
];

export default {
  key: "testrail-list-cases",
  name: "List Cases",
  description: "Lists the test cases of a TestRail project, optionally narrowed to a suite, a section or a title search. Use it to check whether a case already exists before creating one, to list the cases in a section, or to count or scan a large suite. Not for the tests of a run and their statuses (use **List Tests**). Multi-suite projects need `suiteId`; the `filter` matches case titles only. Returns each case's id plus the requested `fields` (default: title, section_id, suite_id, priority_id, type_id), and has_more and next_offset when truncated. Pass `fields` such as `[\"title\"]` and a larger `maxResults` to scan big suites cheaply. Example: projectId=4, suiteId=28, filter=\"fence\", fields=[\"title\"] → `[{id: 1715, title: \"Electric fence trips at 10kV breach\"}]`. [See the documentation](https://support.testrail.com/hc/en-us/sections/7077185274644-API-reference)",
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
      description: "Only return cases in this section. Use **List Sections** to find it. Example: `136`.",
      optional: true,
    },
    filter: {
      type: "string",
      label: "Title Filter",
      description: "Only return cases whose title contains this text. Example: `fence`.",
      optional: true,
    },
    priorityIds: {
      type: "integer[]",
      label: "Priority IDs",
      description: "Only return cases with one of these priority IDs (defaults: 1 Low, 2 Medium, 3 High, 4 Critical). Example: `[3, 4]`.",
      optional: true,
    },
    typeIds: {
      type: "integer[]",
      label: "Type IDs",
      description: "Only return cases of these case-type IDs (for example 6 Functional, 9 Regression on default instances). Example: `[6, 9]`.",
      optional: true,
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description: "Field names to return per case (`id` is always included). Defaults to: title, section_id, suite_id, priority_id, type_id. Other values: `refs`, `estimate`, `created_on`, `updated_on`, `custom_preconds`, `custom_steps_separated`, `custom_expected`.",
      optional: true,
    },
    maxResults: {
      propDefinition: [
        app,
        "maxResults",
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
    const {
      items, has_more, next_offset,
    } = await this.app.paginate({
      $,
      path: `get_cases/${this.projectId}`,
      key: "cases",
      params: {
        suite_id: this.suiteId,
        section_id: this.sectionId,
        filter: this.filter,
        priority_id: joinIds(this.priorityIds),
        type_id: joinIds(this.typeIds),
      },
      maxResults: this.maxResults,
      offset: this.offset,
    });
    const fields = this.fields?.length
      ? this.fields
      : DEFAULT_FIELDS;
    const cases = items.map((c) => pluck(c, fields));
    $.export("$summary", `Found ${cases.length} case(s) in project ${this.projectId}${has_more
      ? " (more available)"
      : ""}`);
    return {
      cases,
      has_more,
      next_offset,
    };
  },
};
