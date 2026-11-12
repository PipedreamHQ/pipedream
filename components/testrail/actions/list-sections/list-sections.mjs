import app from "../../testrail.app.mjs";
import utils from "../../common/utils.mjs";

const DEFAULT_FIELDS = [
  "name",
  "suite_id",
  "parent_id",
  "depth",
  "description",
];

export default {
  key: "testrail-list-sections",
  name: "List Sections",
  description: "List the sections (folders that group test cases) of a TestRail project or suite, with parent and depth so the nesting is clear. Use it to find the section ID that **Add Case**, **Add Section** (as parentId) and **List Cases** need, and to check whether a section already exists before creating one. On multi-suite projects pass suiteId when you know it (from **Get Metadata**, resource `suites`); if omitted, every suite of the project (up to 20) is listed and each section carries its `suite_id`; the project ID comes from **List Projects**. Example: to find the \"Gate Security\" section in project 12, suite 40, call with projectId=12, suiteId=40 → returns sections with id, name, suite_id, parent_id, depth. Common mistake: assuming section names are unique; the same name can exist in several suites, so check `suite_id`. Returns at most 250 sections by default (hard cap 1000). [See the documentation](https://support.testrail.com/hc/en-us/articles/7077918603412-Sections)",
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
    limit: {
      propDefinition: [
        app,
        "limit",
      ],
    },
    fields: {
      propDefinition: [
        app,
        "fields",
      ],
      description: `Field names to return per section (\`id\` is always included). Defaults to: ${DEFAULT_FIELDS.join(", ")}. Other available: display_order.`,
    },
  },
  async run({ $ }) {
    const params = {};
    const suiteIds = await this.app.resolveSuiteIds({
      $,
      projectId: this.projectId,
      suiteId: this.suiteId,
    });
    const pages = await Promise.all(suiteIds.map((suiteId) => this.app.paginate({
      $,
      path: `get_sections/${this.projectId}`,
      resourceKey: "sections",
      params: suiteId
        ? {
          ...params,
          suite_id: suiteId,
        }
        : params,
      max: this.limit,
    })));
    const limit = Math.min(this.limit || 250, 1000);
    const all = pages.flatMap((page) => page.items);
    const items = all.slice(0, limit);
    const hasMore = all.length > limit || pages.some((page) => page.hasMore);
    const sections = utils.selectFields(items, this.fields, DEFAULT_FIELDS);
    $.export("$summary", `Found ${sections.length} section${sections.length === 1
      ? ""
      : "s"}`);
    return {
      sections,
      has_more: hasMore,
    };
  },
};
