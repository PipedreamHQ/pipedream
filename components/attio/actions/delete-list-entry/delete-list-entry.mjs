// x-pd-ai: optimized
import attio from "../../attio.app.mjs";

export default {
  key: "attio-delete-list-entry",
  name: "Delete List Entry",
  description: "Delete an entry from a list (this removes the record from the list, not the underlying record itself). Destructive — confirm the entry before deleting. Use **List List ID Options** to find a **List ID**, then choose the **Entry ID** to remove. Example: List ID `33ebdbe9-e529-47c9-b894-0ba25e9c15c0`, Entry ID `2e6e29ea-c4e9-4f4b-9b1e-7f2c1a0d9c11`. Returns the API confirmation. [See the documentation](https://developers.attio.com/reference/delete_v2-lists-list-entries-entry-id)",
  version: "0.0.7",
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
