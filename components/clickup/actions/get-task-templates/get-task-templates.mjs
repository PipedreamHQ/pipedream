import clickup from "../../clickup.app.mjs";

export default {
  key: "clickup-get-task-templates",
  name: "Get Task Templates",
  description: "Get a list of templates. See the docs [here](https://clickup.com/api) in **Task Templates  / Get Task Templates** section.",
  version: "0.0.1",
  type: "action",
  props: {
    clickup,
    workspaceId: {
      propDefinition: [
        clickup,
        "workspaces",
      ],
    },
    page: {
      type: "integer",
      label: "page",
      description: "Page to return templates",
      min: 0,
      default: 0,
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      workspaceId,
      page,
    } = this;

    return this.clickup.getTaskTemplates({
      $,
      workspaceId,
      params: {
        page,
      },
    });
  },
};
