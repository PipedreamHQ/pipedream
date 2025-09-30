import app from "../../modelry.app.mjs";

export default {
  key: "modelry-create-product",
  name: "Create Product",
  description: "Create a new product. [See the documentation](https://files.cgtarsenal.com/api/doc/index.html#api-Products-CreateProduct)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    sku: {
      propDefinition: [
        app,
        "sku",
      ],
    },
    title: {
      propDefinition: [
        app,
        "title",
      ],
    },
    batchId: {
      propDefinition: [
        app,
        "batchId",
      ],
    },
    description: {
      propDefinition: [
        app,
        "description",
      ],
    },
    tags: {
      propDefinition: [
        app,
        "tags",
      ],
    },
    dimensions: {
      propDefinition: [
        app,
        "dimensions",
      ],
    },
    externalUrl: {
      propDefinition: [
        app,
        "externalUrl",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.createProduct({
      $,
      data: {
        product: {
          sku: this.sku,
          title: this.title,
          batch_id: this.batchId,
          description: this.description,
          tags: this.tags,
          dimensions: this.dimensions,
          external_url: this.externalUrl,
        },
      },
    });
    $.export("$summary", `Successfully created product "${response.data.attributes.title}" with ID: ${response.data.id}`);
    return response;
  },
};
