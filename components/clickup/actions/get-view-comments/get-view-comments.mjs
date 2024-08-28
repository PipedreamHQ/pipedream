import builder from "../../common/builder.mjs";
import propsFragments from "../../common/props-fragments.mjs";
import common from "../common/list-props.mjs";

export default {
  ...common,
  key: "clickup-get-view-comments",
  name: "Get View Comments",
  description: "Get a view comments. See the docs [here](https://clickup.com/api) in **Comments / Get Chat View Comments** section.",
  version: "0.0.9",
  type: "action",
  props: {
    ...common.props,
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
    const { viewId } = this;

    const response = await this.clickup.getViewComments({
      $,
      viewId,
    });

    $.export("$summary", "Successfully retrieved view comments");

    return response;
  },
};
