import app from "../../testrail.app.mjs";

export default {
  key: "testrail-create-section",
  name: "Create Section",
  description: "Create a section (folder for test cases) in a TestRail project. Use before **Create Case** when no suitable section exists — check **List Sections** first to avoid duplicates. In multi-suite projects (`suite_mode` 3 in **List Projects**) `suiteId` is required (from **List Suites**). Pass `parentId` to nest it under another section. Example: projectId=412, suiteId=8731, sectionName=\"Gate Lockdown\" → returns {id: 415, name: \"Gate Lockdown\", suite_id: 31}; then use that id as `sectionId` in **Create Case**. [See the documentation](https://support.testrail.com/hc/en-us/articles/7077918603412-Sections#addsection)",
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
    suiteId: {
      propDefinition: [
        app,
        "suiteId",
      ],
    },
    sectionName: {
      type: "string",
      label: "Name",
      description: "Section name.",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Optional section description.",
      optional: true,
    },
    parentId: {
      type: "integer",
      label: "Parent Section ID",
      description: "Nest under this section (from **List Sections**). Omit for a top-level section.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.addSection({
      $,
      projectId: this.projectId,
      data: {
        name: this.sectionName,
        description: this.description,
        suite_id: this.suiteId,
        parent_id: this.parentId,
      },
    });
    $.export("$summary", `Created section ${response.id}: ${response.name}`);
    return response;
  },
};
