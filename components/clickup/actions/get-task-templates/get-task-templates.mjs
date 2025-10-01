import common from "../common/workspace-prop.mjs";

export default {
  key: "clickup-get-task-templates",
  name: "Get Task Templates",
  description: "Get a list of templates. [See the documentation](https://clickup.com/api) in **Task Templates / Get Task Templates** section.",
  version: "0.0.12",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    ...common.props,
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

    const response = await this.clickup.getTaskTemplates({
      $,
      workspaceId,
      params: {
        page,
      },
    });

    $.export("$summary", "Successfully retrieved task templates");

    return response;
  },
};
