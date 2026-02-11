import todoist from "../../todoist.app.mjs";

export default {
  key: "todoist-update-section",
  name: "Update Section",
  description: "Updates a section. [See the documentation](https://developer.todoist.com/api/v1#tag/Sections/operation/update_section_api_v1_sections__section_id__post)",
  version: "0.0.5",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    todoist,
    project: {
      propDefinition: [
        todoist,
        "project",
      ],
    },
    section: {
      propDefinition: [
        todoist,
        "section",
        (c) => ({
          project: c.project,
        }),
      ],
      description: "The section to update",
      optional: false,
    },
    name: {
      propDefinition: [
        todoist,
        "name",
      ],
    },
  },
  async run ({ $ }) {
    const {
      section,
      name,
    } = this;
    const data = {
      sectionId: section,
      name,
    };
    // No interesting data is returned from Todoist
    await this.todoist.updateSection({
      $,
      data,
    });
    $.export("$summary", "Successfully updated section");
    return {
      id: section,
      success: true,
    };
  },
};
