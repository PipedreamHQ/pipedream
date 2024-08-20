import builder from "../../common/builder.mjs";
import propsFragments from "../../common/props-fragments.mjs";
import common from "../common/list-props.mjs";

export default {
  ...common,
  key: "clickup-get-view-tasks",
  name: "Get View Tasks",
  description: "Get all tasks of a view. See the docs [here](https://clickup.com/api) in **Views / Get View Tasks** section.",
  version: "0.0.9",
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
    listWithFolder: {
      optional: true,
      propDefinition: [
        common.props.clickup,
        "listWithFolder",
      ],
    },
  },
  additionalProps: builder.buildListProps({
    listPropsOptional: true,
    tailProps: {
      viewId: propsFragments.viewId,
    },
  }),
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
