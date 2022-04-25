import todoist from "../../todoist.app.mjs";

export default {
  key: "todoist-create-section",
  name: "Create Section",
  description: "Creates a section. [See the docs here](https://developer.todoist.com/rest/v1/#create-a-new-section)",
  version: "0.0.1",
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
