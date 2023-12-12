import common from "../common/list-props.mjs";

export default {
  key: "clickup-get-list-comments",
  name: "Get List Comments",
  description: "Get a list comments. See the docs [here](https://clickup.com/api) in **Comments / Get List Comments** section.",
  version: "0.0.7",
  type: "action",
  props: common.props,
  async run({ $ }) {
    const { listId } = this;

    const response = await this.clickup.getListComments({
      $,
      listId,
    });

    $.export("$summary", "Successfully retrieved list comments");

    return response;
  },
};
