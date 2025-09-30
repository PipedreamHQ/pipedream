import attio from "../../attio.app.mjs";

export default {
  key: "attio-delete-list-entry",
  name: "Delete List Entry",
  description: "Deletes an existing entry from a specific list. [See the documentation](https://developers.attio.com/reference/delete_v2-lists-list-entries-entry-id)",
  version: "0.0.6",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
        ({ listId }) => ({
          listId,
        }),
      ],
    },
  },
  methods: {
    deleteListEntry({
      listId, entryId, ...opts
    }) {
      return this.attio.delete({
        path: `/lists/${listId}/entries/${entryId}`,
        ...opts,
      });
    },
  },
  async run({ $ }) {
    const response = await this.deleteListEntry({
      $,
      listId: this.listId,
      entryId: this.entryId,
    });
    $.export("$summary", `Successfully deleted list entry with ID: ${this.entryId}`);
    return response;
  },
};
