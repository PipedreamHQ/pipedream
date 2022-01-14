import todoist from "../../todoist.app.mjs";

export default {
  key: "todoist-delete-section",
  name: "Delete Section",
  description: "Deletes a section. [See the docs here](https://developer.todoist.com/rest/v1/#delete-a-section)",
  version: "0.0.1",
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
