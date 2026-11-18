import app from "../../testrail.app.mjs";

export default {
  key: "testrail-create-section",
  name: "Create Section",
  description: "Create a section (a folder for test cases) in a TestRail project. Use it when new tests need a place that doesn't exist yet, such as a section for a new feature. Check **List Sections** first so you don't create a duplicate; to add cases to the section afterwards, use **Create Case**. Multi-suite projects need a suite ID. Returns the new section's id, name, suite_id, parent_id and depth. Example: projectId=4, suiteId=15, name=\"Incubator Alarm\" → {id: 120, name: \"Incubator Alarm\", suite_id: 15}. [See the documentation](https://support.testrail.com/hc/en-us/sections/7077185274644-API-reference)",
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
    name: {
      type: "string",
      label: "Name",
      description: "The section's name, e.g. `Incubator Alarm`.",
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
      description: "Create this as a sub-section of the section with this ID, e.g. `74`. Leave empty for a top-level section. Use **List Sections** to find it.",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "What the section covers, e.g. `Alarm behavior of the egg incubator`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      name: this.name,
    };
    if (this.suiteId) data.suite_id = this.suiteId;
    if (this.parentId) data.parent_id = this.parentId;
    if (this.description) data.description = this.description;
    const section = await this.app._makeRequest({
      $,
      method: "POST",
      endpoint: `add_section/${this.projectId}`,
      data,
    });
    $.export("$summary", `Created section ${section.id}: ${section.name}`);
    return section;
  },
};
