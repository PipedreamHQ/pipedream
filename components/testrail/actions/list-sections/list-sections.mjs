import app from "../../testrail.app.mjs";
import { toPage } from "../../common/utils.mjs";

export default {
  key: "testrail-list-sections",
  name: "List Sections",
  description: "List the sections (folders) that organise test cases in a TestRail project/suite, with `parent_id` for nesting. Use before **Create Case** (which needs a `sectionId`), **Create Section** (to avoid duplicates and find a parent) or to narrow **List Cases**. In multi-suite projects (`suite_mode` 3 in **List Projects**) `suiteId` is required — get it from **List Suites**. Example: projectId=412, suiteId=8731 → returns [{id: 410, name: \"Raptor Paddock Safety\", parent_id: null}, {id: 411, name: \"Visitor Center\"}]. [See the documentation](https://support.testrail.com/hc/en-us/articles/7077918603412-Sections)",
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
    offset: {
      propDefinition: [
        app,
        "offset",
      ],
    },
  },
  async run({ $ }) {
    const limit = this.limit ?? 100;
    const response = await this.app.getSections({
      $,
      projectId: this.projectId,
      params: {
        suite_id: this.suiteId,
        limit,
        offset: this.offset,
      },
    });
    const page = toPage(response, "sections", {
      offset: this.offset ?? 0,
      limit,
    });
    page.sections = page.sections.map(({
      id, name, parent_id, suite_id, depth, description,
    }) => ({
      id,
      name,
      parent_id,
      suite_id,
      depth,
      description,
    }));
    $.export("$summary", `Found ${page.count} section(s)`);
    return page;
  },
};
