import common from "../common/list-props.mjs";

export default {
  key: "clickup-get-list",
  name: "Get List",
  description: "Get a list. See the docs [here](https://clickup.com/api) in **Lists / Get List** section.",
  version: "0.0.7",
  type: "action",
  props: common.props,
  async run({ $ }) {
    const { listId } = this;

    const response = await this.clickup.getList({
      $,
      listId,
    });

    $.export("$summary", "Successfully retrieved list");

    return response;
  },
};
