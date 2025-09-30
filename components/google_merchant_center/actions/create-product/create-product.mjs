import {
  LANGUAGE_OPTIONS, TERRITORY_OPTIONS,
} from "../../common/constants.mjs";
import googleMerchant from "../../google_merchant_center.app.mjs";

export default {
  key: "google_merchant_center-create-product",
  name: "Create Product",
  description: "Creates a product in your Google Merchant Center account. [See the documentation](https://developers.google.com/shopping-content/reference/rest/v2.1/products/insert)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    googleMerchant,
    offerId: {
      type: "string",
      label: "Offer ID",
      description: "A unique identifier for the item. Leading and trailing whitespaces are stripped and multiple whitespaces are replaced by a single whitespace upon submission. Only valid unicode characters are accepted. See the [products feed specification](https://support.google.com/merchants/answer/188494#id) for details.",
    },
    title: {
      type: "string",
      label: "Title",
      description: "Your product's name. Max 150 characters",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "Your product's description. Max 5000 characters",
      optional: true,
    },
    contentLanguage: {
      type: "string",
      label: "Content Language",
      description: "The [two-letter ISO 639-1 language code](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) for the item.",
      options: LANGUAGE_OPTIONS,
    },
    targetCountry: {
      type: "string",
      label: "Target Country",
      description: "The [CLDR territory code](https://github.com/unicode-org/cldr/blob/latest/common/main/en.xml) for the item's country of sale.",
      options: TERRITORY_OPTIONS,
    },
    channel: {
      type: "string",
      label: "Channel",
      description: "The item's channel (online or local).",
      options: [
        "local",
        "online",
      ],
    },
    additionalOptions: {
      type: "object",
      label: "Additional Options",
      description: "Additional options for the product. If a value is not a string, it will be parsed as JSON. [See the documentation here](https://developers.google.com/shopping-content/reference/rest/v2.1/products#Product)",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      additionalOptions, googleMerchant, ...data
    } = this;

    Object.entries(additionalOptions ?? {}).forEach(([
      key,
      value,
    ]) => {
      try {
        additionalOptions[key] = JSON.parse(value);
      } catch (e) {
        // ignore non-serializable values
      }
    });

    const response = await googleMerchant.createProduct({
      $,
      data: {
        ...data,
        ...additionalOptions,
      },
    });
    $.export("$summary", `Product ${response.id} created successfully`);
    return response;
  },
};
