import common from "../common/view-props.mjs";

export default {
  key: "clickup-get-view-comments",
  name: "Get View Comments",
  description: "Get a view comments. See the docs [here](https://clickup.com/api) in **Comments / Get Chat View Comments** section.",
  version: "0.0.7",
  type: "action",
  props: common.props,
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
