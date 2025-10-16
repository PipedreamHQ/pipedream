import app from "../../lightspeed_ecom_c_series.app.mjs";

export default {
  key: "lightspeed_ecom_c_series-find-product",
  name: "Find Product",
  description: "Find an product by ID. [See the documentation](https://developers.lightspeedhq.com/ecom/endpoints/product/#get-all-products)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    brandId: {
      propDefinition: [
        app,
        "brandId",
      ],
      optional: true,
    },
    sinceId: {
      type: "string",
      label: "Since ID",
      description: "Restrict results to after the specified ID",
      optional: true,
    },
    createdAtMin: {
      propDefinition: [
        app,
        "createdAtMin",
      ],
    },
    createdAtMax: {
      propDefinition: [
        app,
        "createdAtMax",
      ],
    },
    updatedAtMin: {
      propDefinition: [
        app,
        "updatedAtMin",
      ],
    },
    updatedAtMax: {
      propDefinition: [
        app,
        "updatedAtMax",
      ],
    },
  },
  async run({ $ }) {
    const response = this.app.paginate({
      fn: this.app.listProduct,
      $,
      params: {
        brand: this.brandId,
        since_id: this.sinceId,
        created_at_min: this.createdAtMin,
        created_at_max: this.createdAtMax,
        updated_at_min: this.updatedAtMin,
        updated_at_max: this.updatedAtMax,
      },
      dataField: "products",
    });

    const products = [];
    for await (const product of response) {
      products.push(product);
    }

    $.export("$summary", `Successfully found ${products.length} product${products.length === 1
      ? ""
      : "s"}`);
    return products;
  },
};
