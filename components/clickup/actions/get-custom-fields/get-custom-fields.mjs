import common from "../common/list-props.mjs";
import builder from "../../common/builder.mjs";

export default {
  ...common,
  key: "clickup-get-custom-fields",
  name: "Get Custom Fields",
  description: "Get a list of custom fields. See the docs [here](https://clickup.com/api) in **Custom Fields / Get Accessible Custom Fields** section.",
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

    const response = await this.clickup.getCustomFields({
      $,
      listId,
    });

    $.export("$summary", "Successfully retrieved custom fields");

    return response;
  },
};
