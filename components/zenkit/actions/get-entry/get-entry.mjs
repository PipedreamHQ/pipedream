import common from "../common/common.mjs";

export default {
  ...common,
  key: "zenkit-get-entry",
  name: "Get Entry",
  description: "Retrieve an entry/item from a list on Zenkit. [See the docs](https://base.zenkit.com/docs/api/entries/get-api-v1-lists-listallid-entries-listentryallid)",
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
  async run({ $ }) {
    const entry = await this.zenkit.getEntry({
      listId: this.listId,
      entryId: this.entryId,
      $,
    });
    $.export("$summary", `Successfully retrieved entry '${entry.displayString}'`);
    return entry;
  },
};
