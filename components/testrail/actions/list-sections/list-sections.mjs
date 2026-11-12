import app from "../../testrail.app.mjs";

export default {
  key: "testrail-list-sections",
  name: "List Sections",
  description: "List the sections (the folder tree that groups test cases) of a TestRail project with each section's `id`, `name`, `parent_id`, `depth` and `suite_id`."
    + " Use to find a section by name before creating a case with **Add Case**, filtering **List Cases** by `sectionId`, or checking whether a section already exists before **Add Section**."
    + " Get the project id from **List Projects**. In a multi-suite project leave `suiteId` empty to list the sections of every suite at once (each item carries its `suite_id`), or pass it to narrow to one suite."
    + " Returns `{ total, truncated, sections }`."
    + " Example: projectId=12 → returns `{ sections: [{ id: 73, name: \"Paddock Security\", suite_id: 15, parent_id: null, depth: 0 }] }`."
    + " [See the documentation](https://support.testrail.com/hc/en-us/articles/7077918603412-Sections)",
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
  },
  async run({ $ }) {
    const suiteIds = await this.app.resolveSuiteIds(this.projectId, this.suiteId);
    const {
      items, truncated,
    } = await this.app.collectAcrossSuites(
      suiteIds,
      (suiteId) => this.app.paginate({
        endpoint: `get_sections/${this.projectId}`,
        params: {
          suite_id: suiteId,
        },
        key: "sections",
        limit: 1000,
      }),
    );
    const sections = items.map(({
      id, name, description, parent_id, suite_id, depth,
    }) => ({
      id,
      name,
      description,
      parent_id,
      suite_id,
      depth,
    }));
    $.export("$summary", `Found ${sections.length} section${sections.length === 1
      ? ""
      : "s"} in project ${this.projectId}`);
    return {
      total: sections.length,
      truncated,
      sections,
    };
  },
};
