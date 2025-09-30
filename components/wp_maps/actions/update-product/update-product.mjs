import wpMaps from "../../wp_maps.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "wp_maps-update-product",
  name: "Update Product",
  description: "Updates an existing product in WP Maps. [See the documentation](https://support.agilelogix.com/hc/en-us/articles/900006795363-API-Access-Points#update-product)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    wpMaps,
    productId: {
      propDefinition: [
        wpMaps,
        "productId",
      ],
    },
    title: {
      propDefinition: [
        wpMaps,
        "title",
      ],
      optional: true,
    },
    description: {
      propDefinition: [
        wpMaps,
        "description",
      ],
      optional: true,
    },
    price: {
      propDefinition: [
        wpMaps,
        "price",
      ],
      optional: true,
    },
    image: {
      propDefinition: [
        wpMaps,
        "image",
      ],
    },
    url: {
      propDefinition: [
        wpMaps,
        "url",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.wpMaps.createOrUpdateProduct({
      data: {
        data: [
          utils.cleanObject({
            id: this.productId,
            title: this.title,
            description: this.description,
            price: this.price,
            image: this.image,
            url: this.url,
          }),
        ],
      },
      $,
    });

    if (response.error) {
      throw new Error(response.error);
    }

    $.export("$summary", `Successfully updated product with ID ${this.productId}.`);

    return response;
  },
};
