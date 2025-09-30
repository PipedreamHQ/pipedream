import common from "../common/common.mjs";

export default {
  ...common,
  key: "zenkit-get-list",
  name: "Get List",
  description: "Retrieve a list/collection from a workspace on Zenkit. [See the docs](https://base.zenkit.com/docs/api/lists/get-api-v1-lists-listshortid)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    ...common.props,
    listId: {
      propDefinition: [
        common.props.zenkit,
        "listId",
        (c) => ({
          workspaceId: c.workspaceId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const list = await this.zenkit.getList({
      listId: this.listId,
      $,
    });
    $.export("$summary", `Successfully retrieved list '${list.name}'`);
    return list;
  },
};
