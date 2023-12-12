import common from "../common/list-props.mjs";

export default {
  key: "clickup-delete-list",
  name: "Delete List",
  description: "Delete a list. See the docs [here](https://clickup.com/api) in **Lists / Delete List** section.",
  version: "0.0.7",
  type: "action",
  props: common.props,
  async run({ $ }) {
    const { listId } = this;

    const response = await this.clickup.deleteList({
      $,
      listId,
    });

    $.export("$summary", "Successfully deleted list");

    return response;
  },
};
