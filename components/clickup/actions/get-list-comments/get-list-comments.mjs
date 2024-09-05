import builder from "../../common/builder.mjs";
import common from "../common/list-props.mjs";

export default {
  ...common,
  key: "clickup-get-list-comments",
  name: "Get List Comments",
  description: "Get a list comments. See the docs [here](https://clickup.com/api) in **Comments / Get List Comments** section.",
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

    const response = await this.clickup.getListComments({
      $,
      listId,
    });

    $.export("$summary", "Successfully retrieved list comments");

    return response;
  },
};
