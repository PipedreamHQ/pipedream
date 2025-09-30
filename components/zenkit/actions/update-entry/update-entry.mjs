import common from "../common/common.mjs";

export default {
  ...common,
  key: "zenkit-update-entry",
  name: "Update Entry",
  description: "Update an entry/item in a list on Zenkit. [See the docs](https://base.zenkit.com/docs/api/entries/put-api-v1-lists-listid-entries-listentryid)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
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
    entryId: {
      propDefinition: [
        common.props.zenkit,
        "entryId",
        (c) => ({
          listId: c.listId,
        }),
      ],
    },
  },
  async additionalProps() {
    return this.getListElementProps(this.listId);
  },
  async run({ $ }) {
    const data = Object.fromEntries(Object.entries(this).filter(([
      key,
    ]) => key !== "zenkit" && key !== "workspaceId" && key !== "listId" && key !== "entryId"));
    const config = {
      listId: this.listId,
      entryId: this.entryId,
      data,
    };
    const entry = await this.zenkit.updateEntry({
      ...config,
      $,
    });
    $.export("$summary", `Successfully updated entry '${entry?.displayString || entry.id}'`);
    return entry;
  },
};
