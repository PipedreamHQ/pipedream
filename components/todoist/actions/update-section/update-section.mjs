import todoist from "../../todoist.app.mjs";

export default {
  key: "todoist-update-section",
  name: "Update Section",
  description: "Updates a section [See the docs here](https://developer.todoist.com/rest/v1/#update-a-section)",
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
  },
};
