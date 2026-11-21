import app from "../../testrail.app.mjs";

export default {
  key: "testrail-create-section",
  name: "Create Section",
  description: "Creates a section (a folder for test cases) in a TestRail project or suite. Use it when the user wants a new group for cases, for example one per feature, before adding cases with **Create Case**. Not for creating cases and not for finding existing sections: check **List Sections** first to avoid duplicates. Multi-suite projects need `suiteId`; set `parentId` to nest it under another section. Returns the new section's id, name, suite_id and parent_id. Example: projectId=4, suiteId=28, name=\"Night Shift Drills\" → `{id: 140, name: \"Night Shift Drills\"}`. [See the documentation](https://support.testrail.com/hc/en-us/sections/7077185274644-API-reference)",
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
    name: {
      type: "string",
      label: "Name",
      description: "The section's name. Example: `Night Shift Drills`.",
    },
    description: {
      type: "string",
      label: "Description",
      description: "What the section covers. Example: `Checks run after dark`.",
      optional: true,
    },
    parentId: {
      type: "integer",
      label: "Parent Section ID",
      description: "ID of the section to nest this one under, from **List Sections**. Leave empty for a top-level section. Example: `136`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.addSection({
      $,
      projectId: this.projectId,
      data: {
        name: this.name,
        description: this.description,
        suite_id: this.suiteId,
        parent_id: this.parentId,
      },
    });
    $.export("$summary", `Created section ${response.id}: ${response.name}`);
    return {
      id: response.id,
      name: response.name,
      description: response.description,
      suite_id: response.suite_id,
      parent_id: response.parent_id,
    };
  },
};
