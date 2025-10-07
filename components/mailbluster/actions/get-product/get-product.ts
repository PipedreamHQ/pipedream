import mailbluster from "../../app/mailbluster.app";

export default {
  key: "mailbluster-get-product",
  name: "Get Product",
  description: "Get a specific product. [See the documentation](https://app.mailbluster.com/api-doc/products/read)",
  type: "action",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    mailbluster,
    productId: {
      propDefinition: [
        mailbluster,
        "productId",
      ],
    },
  },
  async run({ $ }) {
    const {
      mailbluster,
      productId,
    } = this;

    const response = await mailbluster.getProduct({
      $,
      productId,
    });

    $.export("$summary", `Product with ID: ${productId} was successfully fetched!`);
    return response;
  },
};
