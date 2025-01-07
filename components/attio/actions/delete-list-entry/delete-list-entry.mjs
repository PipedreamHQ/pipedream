import attio from "../../attio.app.mjs";

export default {
  key: "attio-delete-list-entry",
  name: "Delete List Entry",
  description: "Deletes an existing entry from a specific list. [See the documentation](https://developers.attio.com/reference/delete_v2-lists-list-entries-entry-id)",
  version: "0.0.2",
  type: "action",
  props: {
    attio,
    listId: {
      propDefinition: [
        attio,
        "listId",
      ],
    },
    entryId: {
      propDefinition: [
        attio,
        "entryId",
        (c) => ({
          listId: c.listId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.attio.deleteListEntry({
      $,
      listId: this.listId,
      entryId: this.entryId,
    });
    $.export("$summary", `Successfully deleted list entry with ID: ${this.entryId}`);
    return response;
  },
};
