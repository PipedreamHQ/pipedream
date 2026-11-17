import app from "../../testrail.app.mjs";

export default {
  key: "testrail-list-sections",
  name: "List Sections",
  description: "Lists the sections (folders that hold test cases) of a TestRail project or suite. Use it to find the section ID that **Create Case** or **Create Section** needs, or to see how a suite is organised. To find the cases themselves use **List Cases**. In a multiple-suite project (suite_mode 3), leaving `suiteId` empty returns the sections of every suite (`limit` and `offset` then apply to each suite separately); pass `suiteId` to narrow it, taking suite IDs from **Get Project**. Returns id, name, description, parent_id, depth and suite_id per section, plus `hasMore`/`nextOffset`. Example: projectId=\"Isla Nublar Test Lab\", suiteId=15 → sections Paddock Security and Feeding Schedule. [See the documentation](https://support.testrail.com/hc/en-us/sections/7077185274644-API-reference)",
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
    parentId: {
      type: "integer",
      label: "Parent Section ID",
      description: "Only return direct children of this section. Leave empty for all sections of the suite.",
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
    const projectId = await this.app.resolveProjectId($, this.projectId);
    const listSuite = (suiteId) => this.app.listPage({
      $,
      path: `get_sections/${projectId}`,
      key: "sections",
      params: this.app.cleanParams({
        suite_id: suiteId,
      }),
      limit: this.limit,
      offset: this.offset,
    });
    let page;
    const project = this.suiteId
      ? null
      : await this.app.get({
        $,
        path: `get_project/${projectId}`,
      });
    if (project?.suite_mode === 3) {
      const suites = this.app.unwrap(await this.app.get({
        $,
        path: `get_suites/${projectId}`,
      }), "suites");
      const pages = await Promise.all(suites.map((suite) => listSuite(suite.id)));
      const hasMore = pages.some((p) => p.hasMore);
      page = {
        items: pages.flatMap((p) => p.items),
        hasMore,
        nextOffset: hasMore
          ? (this.offset || 0) + Math.max(...pages.map((p) => p.size))
          : null,
      };
    } else {
      page = await listSuite(this.suiteId);
    }
    if (this.parentId) page.items = page.items.filter((s) => s.parent_id === this.parentId);
    page.items = page.items.map(({
      id, name, description, parent_id, depth, suite_id,
    }) => ({
      id,
      name,
      description,
      parent_id,
      depth,
      suite_id,
    }));
    page.size = page.items.length;
    $.export("$summary", `Found ${page.size} sections`);
    return page;
  },
};
