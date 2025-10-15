import squarespace from "../../squarespace.app.mjs";

export default {
  key: "squarespace-get-product",
  name: "Get Product",
  description: "Get a specific product. [See docs here](https://developers.squarespace.com/commerce-apis/retrieve-specific-products)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    squarespace,
    productId: {
      propDefinition: [
        squarespace,
        "productId",
      ],
    },
  },
  methods: {},
  async run({ $ }) {
    const response = await this.squarespace.getProduct({
      $,
      productId: this.productId,
    });

    $.export("$summary", "Successfully retrieved product.");

    return response;
  },
};
