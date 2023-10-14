import googleMerchant from "../../google_merchant_center.app.mjs";

export default {
  key: "google_merchant_center-create-product",
  name: "Create Product",
  description: "Creates a product in your Google Merchant Center account. [See the documentation](https://developers.google.com/shopping-content/reference/rest/v2.1/products/insert)",
  version: "0.0.1",
  type: "action",
  props: {
    googleMerchant,
    merchantId: {
      propDefinition: [
        googleMerchant,
        "merchantId",
      ],
    },
    title: {
      type: "string",
      label: "Title",
      description: "Your product's name. Max 150 characters",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Your product's description. Max 5000 characters",
    },
    link: {
      type: "string",
      label: "Link",
      description: "Your product's landing page",
    },
    imageLink: {
      type: "string",
      label: "Image Link",
      description: "The URL of your product's main image",
    },
    additionalOptions: {
      type: "string",
      label: "Additional Options",
      description: "Additional options for the product. [See the documentation here](https://support.google.com/merchants/answer/7052112?visit_id=638329007290220641-1391271113)",
    },
  },
  async run({ $ }) {
    const additionalOptions = this.additionalOptions ?? {};
    Object.entries(additionalOptions).forEach(([
      key,
      value,
    ]) => {
      try {
        additionalOptions[key] = JSON.parse(value);
      } catch (e) {
        // ignore non-serializable values
      }
    });
    const response = await this.googleMerchant.createProduct({
      merchantId: this.merchantId,
      data: {
        title: this.title,
        description: this.description,
        link: this.link,
        image_link: this.imageLink,
        ...additionalOptions,
      },
    });
    $.export("$summary", `Product ${response.id} created successfully`);
    return response;
  },
};
