import todoist from "../../todoist.app.mjs";

export default {
  key: "todoist-delete-section",
  name: "Delete Section",
  description: "Deletes a section. [See the documentation](https://developer.todoist.com/api/v1#tag/Sections/operation/delete_section_api_v1_sections__section_id__delete)",
  version: "0.0.7",
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
    },
  },
  async run ({ $ }) {
    const { section } = this;
    const data = {
      sectionId: section,
    };
    // No interesting data is returned from Todoist
    await this.todoist.deleteSection({
      $,
      data,
    });
    $.export("$summary", "Successfully deleted section");
    return {
      id: section,
      success: true,
    };
  },
};
