import common from "../common/list-props.mjs";

export default {
  key: "clickup-get-list-views",
  name: "Get List Views",
  description: "Get all views of a list. See the docs [here](https://clickup.com/api) in **Views / Get List Views** section.",
  version: "0.0.7",
  type: "action",
  props: common.props,
  async run({ $ }) {
    const { listId } = this;

    const response = await this.clickup.getListViews({
      $,
      listId,
    });

    $.export("$summary", "Successfully retrieved list views");

    return response;
  },
};
