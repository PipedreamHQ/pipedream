import app from "../../testrail.app.mjs";

export default {
  key: "testrail-add-section",
  name: "Add Section",
  description: "Create a section (a folder for test cases) in a TestRail project, optionally nested under another section."
    + " Use before **Add Case** when the cases you are about to write need a new home. Check **List Sections** first so you do not create a duplicate, and use the returned `id` as `sectionId` in **Add Case**."
    + " In a multi-suite project (`suite_mode` 3 in **List Projects**) `suiteId` is required; find suites with **Get Metadata** (`include=[\"suites\"]`)."
    + " Example: projectId=12, suiteId=15, sectionName=\"Quarantine Procedures\", description=\"Isolation steps for sick animals\" → returns `{ id: 74, name: \"Quarantine Procedures\", suite_id: 15, parent_id: null, depth: 0 }`."
    + " [See the documentation](https://support.testrail.com/hc/en-us/articles/7077918603412-Sections)",
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
      description: "Suite to create the section in. Required for multi-suite projects; omit for single-suite projects.",
    },
    sectionName: {
      type: "string",
      label: "Name",
      description: "Section name, e.g. `Quarantine Procedures`.",
    },
    description: {
      type: "string",
      label: "Description",
      description: "What the section covers.",
      optional: true,
    },
    parentId: {
      type: "integer",
      label: "Parent Section ID",
      description: "Nest the new section under this section id (from **List Sections**). Omit for a top-level section.",
      optional: true,
    },
  },
  async run({ $ }) {
    const section = await this.app._makeRequest({
      endpoint: `add_section/${this.projectId}`,
      method: "POST",
      data: {
        name: this.sectionName,
        description: this.description,
        suite_id: this.suiteId,
        parent_id: this.parentId,
      },
    });
    $.export("$summary", `Created section ${section.id}: ${section.name}`);
    return {
      id: section.id,
      name: section.name,
      description: section.description,
      suite_id: section.suite_id,
      parent_id: section.parent_id,
      depth: section.depth,
    };
  },
};
