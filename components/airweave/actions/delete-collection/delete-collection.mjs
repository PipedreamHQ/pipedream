import airweave from "../../airweave.app.mjs";

export default {
  key: "airweave-delete-collection",
  name: "Delete Collection",
  description: "Delete a collection and all associated data. This permanently removes the collection including all synced data and source connections. This action cannot be undone. [See the documentation](https://docs.airweave.ai/api-reference/collections/delete)",
  version: "0.0.1",
  type: "action",
  props: {
    airweave,
    collectionId: {
      propDefinition: [
        airweave,
        "collectionId",
      ],
    },
    confirmation: {
      type: "string",
      label: "Confirmation",
      description: "Type 'DELETE' to confirm deletion. This action cannot be undone.",
    },
  },
  async run({ $ }) {
    if (this.confirmation !== "DELETE") {
      throw new Error("Please type 'DELETE' to confirm deletion. This action cannot be undone.");
    }

    const response = await this.airweave.deleteCollection(this.collectionId);

    $.export("$summary", `Successfully deleted collection: ${response.name} (${response.readable_id})`);
    
    return response;
  },
};

