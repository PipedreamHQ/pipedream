import common from "../common/list-props.mjs";
import builder from "../../common/builder.mjs";

export default {
  ...common,
  key: "clickup-delete-list",
  name: "Delete List",
  description: "Delete a list. See the docs [here](https://clickup.com/api) in **Lists / Delete List** section.",
  version: "0.0.8",
  type: "action",
  props: {
    ...common.props,
    listWithFolder: {
      propDefinition: [
        common.props.clickup,
        "listWithFolder",
      ],
    },
  },
  additionalProps: builder.buildListProps(),
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
