import common from "../common/view-props.mjs";

export default {
  key: "clickup-get-view-tasks",
  name: "Get View Tasks",
  description: "Get all tasks of a view. See the docs [here](https://clickup.com/api) in **Views / Get View Tasks** section.",
  version: "0.0.7",
  type: "action",
  props: {
    ...common.props,
    page: {
      type: "integer",
      label: "Page",
      description: "The page number to be returned",
      min: 0,
      default: 0,
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      viewId,
      page,
    } = this;

    const response = await this.clickup.getViewTasks({
      $,
      viewId,
      params: {
        page,
      },
    });

    $.export("$summary", "Successfully retrieved tasks");

    return response;
  },
};
