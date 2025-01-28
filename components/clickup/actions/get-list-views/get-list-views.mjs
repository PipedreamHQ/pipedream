import builder from "../../common/builder.mjs";
import common from "../common/list-props.mjs";

export default {
  ...common,
  key: "clickup-get-list-views",
  name: "Get List Views",
  description: "Get all views of a list. See the docs [here](https://clickup.com/api) in **Views / Get List Views** section.",
  version: "0.0.9",
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

    const response = await this.clickup.getListViews({
      $,
      listId,
    });

    $.export("$summary", "Successfully retrieved list views");

    return response;
  },
};
