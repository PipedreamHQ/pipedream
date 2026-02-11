import todoist from "../../todoist.app.mjs";

export default {
  key: "todoist-create-section",
  name: "Create Section",
  description: "Creates a section. [See the documentation](https://developer.todoist.com/api/v1#tag/Sections/operation/create_section_api_v1_sections_post)",
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
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
      optional: false,
    },
    name: {
      propDefinition: [
        todoist,
        "name",
      ],
    },
    order: {
      propDefinition: [
        todoist,
        "order",
      ],
    },
  },
  async run ({ $ }) {
    const {
      project,
      name,
      order,
    } = this;
    const data = {
      project_id: project,
      name,
      order,
    };
    const resp = await this.todoist.createSection({
      $,
      data,
    });
    $.export("$summary", "Successfully created section");
    return resp;
  },
};
