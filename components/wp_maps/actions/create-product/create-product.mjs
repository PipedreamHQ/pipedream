import wpMaps from "../../wp_maps.app.mjs";

export default {
  key: "wp_maps-create-product",
  name: "Create Product",
  description: "Creates a new product in WP Maps. [See the documentation](https://support.agilelogix.com/hc/en-us/articles/900006795363-API-Access-Points#create-product)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    wpMaps,
    title: {
      propDefinition: [
        wpMaps,
        "title",
      ],
    },
    description: {
      propDefinition: [
        wpMaps,
        "description",
      ],
    },
    price: {
      propDefinition: [
        wpMaps,
        "price",
      ],
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
          {
            title: this.title,
            description: this.description,
            price: this.price,
            image: this.image,
            url: this.url,
          },
        ],
      },
      $,
    });

    if (response.error) {
      throw new Error(response.error);
    }

    $.export("$summary", `Successfully created product with ID ${response.products[0].id}.`);

    return response;
  },
};
