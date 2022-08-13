import zenkit from "../../zenkit.app.mjs";

export default {
  key: "zenkit-get-entry",
  name: "Get Entry",
  description: "Retrieve an entry from a list on Zenkit. [See the docs](https://base.zenkit.com/docs/api/entries/get-api-v1-lists-listallid-entries-listentryallid)",
  //version: "0.0.1",
  version: "0.0.2",
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
    entryId: {
      propDefinition: [
        zenkit,
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
    $.export("$summary", `Successfully retrieved entry ${entry.displayString}`);
    return entry;
  },
};
