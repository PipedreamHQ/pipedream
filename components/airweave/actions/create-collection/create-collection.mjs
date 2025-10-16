import airweave from "../../airweave.app.mjs";

export default {
  key: "airweave-create-collection",
  name: "Create Collection",
  description: "Create a new Airweave collection. Collections are logical groups of data sources that provide unified search capabilities. The newly created collection is initially empty until you add source connections to it. [See the documentation](https://docs.airweave.ai/api-reference/collections/create)",
  version: "0.0.1",
  type: "action",
  props: {
    airweave,
    name: {
      type: "string",
      label: "Name",
      description: "Display name for the collection (e.g., 'Customer Support Data')",
    },
    readableId: {
      type: "string",
      label: "Readable ID",
      description: "URL-friendly identifier for the collection (lowercase, hyphens allowed, e.g., 'customer-support-data'). This cannot be changed after creation.",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Optional description of what this collection contains and its purpose",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.airweave.createCollection({
      name: this.name,
      readable_id: this.readableId,
      description: this.description,
    });

    $.export("$summary", `Successfully created collection: ${response.name} (${response.readable_id})`);
    
    return response;
  },
};

