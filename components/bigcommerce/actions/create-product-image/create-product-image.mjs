import app from "../../bigcommerce.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "bigcommerce-create-product-image",
  name: "Create Product Image",
  description:
    "Create a product image. [See the docs here](https://developer.bigcommerce.com/docs/rest-catalog/products/images#create-a-product-image)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    productId: {
      propDefinition: [
        app,
        "productId",
      ],
    },
    imageFile: {
      propDefinition: [
        app,
        "imageFile",
      ],
    },
    imageUrl: {
      propDefinition: [
        app,
        "imageUrl",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      productId,
      imageFile,
      imageUrl,
    } = this;

    const response = await app.createProductImage({
      $,
      productId,
      ...(imageFile?.startsWith("/") && {
        headers: constants.MULTIPART_FORM_DATA_HEADERS,
      }),
      data: {
        image_file: imageFile,
        image_url: imageUrl,
      },
    });

    $.export("$summary", `Successfully created product image with ID \`${response.data.id}\``);
    return response;
  },
};
