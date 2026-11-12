import app from "../../testrail.app.mjs";

export default {
  key: "testrail-add-section",
  name: "Add Section",
  description: "Create a section (a folder that groups test cases) in a TestRail project, optionally nested under another section. Use it before **Add Case** when no suitable section exists; check **List Sections** first so you do not create a duplicate. On multi-suite projects pass suiteId (from **Get Metadata**, resource `suites`). Returns the new section with its `id`, which **Add Case** needs as sectionId. Example: to add a \"Gate Security\" folder to suite 40 of project 12, call with projectId=12, suiteId=40, sectionName=\"Gate Security\" → returns {id: 77, name: \"Gate Security\", suite_id: 40}. Common mistake: setting parentId to a section from a different suite. [See the documentation](https://support.testrail.com/hc/en-us/articles/7077918603412-Sections)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    projectId: {
      propDefinition: [
        app,
        "projectId",
      ],
    },
    sectionName: {
      type: "string",
      label: "Name",
      description: "Name of the new section.",
    },
    suiteId: {
      propDefinition: [
        app,
        "suiteId",
      ],
      description: "Suite to create the section in. Required on multi-suite projects; omit for single-suite projects.",
    },
    parentId: {
      type: "integer",
      label: "Parent Section ID",
      description: "Nest the new section under this section (from **List Sections**). Omit for a top-level section.",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "Optional description of the section.",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      name: this.sectionName,
    };
    if (this.suiteId) data.suite_id = this.suiteId;
    if (this.parentId) data.parent_id = this.parentId;
    if (this.description) data.description = this.description;
    const response = await this.app._makeRequest({
      $,
      path: `add_section/${this.projectId}`,
      method: "POST",
      data,
    });
    $.export("$summary", `Created section ${response.id}: ${response.name}`);
    return response;
  },
};
