import zenkit from "../../zenkit.app.mjs";

export default {
  key: "zenkit-get-list",
  name: "Get List",
  description: "Retrieve a list/collection from a workspace on Zenkit. [See the docs](https://base.zenkit.com/docs/api/lists/get-api-v1-lists-listshortid)",
  version: "0.0.1",
  type: "action",
  props: {
    zenkit,
    workspaceId: {
      propDefinition: [
        zenkit,
        "workspaceId",
      ],
    },
    listId: {
      propDefinition: [
        zenkit,
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
    $.export("$summary", `Successfully retrieved list ${list.name}`);
    return list;
  },
};
