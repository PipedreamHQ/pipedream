import app from "../../testrail.app.mjs";

export default {
  key: "testrail-create-section",
  name: "Create Section",
  description: "Creates a section (a folder for test cases) in a TestRail project. Use it when new test cases need a home that does not exist yet; run **List Sections** first so you do not create a duplicate. To add a case to an existing section use **Create Case**. In a multiple-suite project (suite_mode 3) `suiteId` is required. Returns the new section's id, name, suite_id and parent_id. Example: projectId=\"Isla Nublar Test Lab\", suiteId=17, name=\"Visitor Gate Scanner\" → section with its id, ready for **Create Case**. [See the documentation](https://support.testrail.com/hc/en-us/sections/7077185274644-API-reference)",
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
      description: "Name of the new section, e.g. `Visitor Gate Scanner`.",
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
      description: "Create the section inside this section. Leave empty for a top-level section. Use **List Sections** to find it.",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "Optional free-text description of the section.",
      optional: true,
    },
  },
  async run({ $ }) {
    const projectId = await this.app.resolveProjectId($, this.projectId);
    const section = await this.app.post({
      $,
      path: `add_section/${projectId}`,
      data: this.app.cleanParams({
        name: this.sectionName,
        suite_id: this.suiteId,
        parent_id: this.parentId,
        description: this.description,
      }),
    });
    $.export("$summary", `Created section ${section.name} (${section.id})`);
    return section;
  },
};
