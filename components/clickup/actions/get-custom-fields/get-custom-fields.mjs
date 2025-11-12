import common from "../common/list-props.mjs";

export default {
  ...common,
  key: "clickup-get-custom-fields",
  name: "Get Custom Fields",
  description: "Get a list of custom fields. [See the documentation](https://clickup.com/api) in **Custom Fields / Get Accessible Custom Fields** section.",
  version: "0.0.13",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    ...common.props,
    folderId: {
      propDefinition: [
        common.props.clickup,
        "folderId",
        (c) => ({
          spaceId: c.spaceId,
        }),
      ],
      optional: true,
    },
    listId: {
      propDefinition: [
        common.props.clickup,
        "listId",
        (c) => ({
          folderId: c.folderId,
          spaceId: c.spaceId,
        }),
      ],
    },
  },
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
