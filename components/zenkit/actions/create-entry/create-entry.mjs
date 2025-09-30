import common from "../common/common.mjs";

export default {
  ...common,
  key: "zenkit-create-entry",
  name: "Create Entry",
  description: "Create an entry/item in a list on Zenkit. [See the docs](https://base.zenkit.com/docs/api/entries/post-api-v1-lists-listid-entries)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
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
      reloadProps: true,
    },
    sortOrder: {
      propDefinition: [
        common.props.zenkit,
        "sortOrder",
      ],
    },
  },
  async additionalProps() {
    return this.getListElementProps(this.listId);
  },
  async run({ $ }) {
    const data = Object.fromEntries(Object.entries(this).filter(([
      key,
    ]) => key !== "zenkit" && key !== "workspaceId" && key !== "listId"));
    const config = {
      listId: this.listId,
      data,
    };
    const entry = await this.zenkit.createEntry({
      ...config,
      $,
    });
    $.export("$summary", `Successfully created entry '${entry?.displayString || entry.id}'`);
    return entry;
  },
};
