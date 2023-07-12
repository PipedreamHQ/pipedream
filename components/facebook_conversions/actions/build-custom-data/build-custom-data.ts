import { defineAction } from "@pipedream/types";
import { ConfigurationError } from "@pipedream/platform";
import app from "../../app/facebook_conversions.app";
import { PURCHASE_EVENT_DELIVERY_CATEGORIES } from "../../common/constants";

const DOCS_LINK = "https://developers.facebook.com/docs/marketing-api/conversions-api/parameters/custom-data";

export default defineAction({
  name: "Build Custom Data",
  description:
    `Construct the Custom Data object to send in an event. [See the documentation](${DOCS_LINK})`,
  key: "facebook_conversions-build-custom-data",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    contentCategory: {
      label: "Content Category",
      description: `The category of the content associated with the event. [See more on this and other props in the documentation](${DOCS_LINK})`,
      type: "string",
      optional: true,
    },
    contentIds: {
      label: "Content IDs",
      description: "The content IDs associated with the event, such as product SKUs for items in an `AddToCart` event. If `Content Type` is a product, then your content IDs must be an array with a single string value. Otherwise, this array can contain any number of string values.",
      type: "string[]",
      optional: true,
    },
    contentName: {
      label: "Content Name",
      description: "The name of the page or product associated with the event.",
      type: "string",
      optional: true,
    },
    contentType: {
      label: "Content Type",
      description: `- Use \`product\` if the keys you send represent products. Sent keys could be content_ids or contents.
\
- Use \`product_group\` if the keys you send in \`Content IDs\` represent product groups. [Product groups](https://developers.facebook.com/docs/marketing-api/reference/product-group) are used to distinguish products that are identical but have variations such as color, material, size or pattern.`,
      type: "string",
      optional: true,
    },
    contents: {
      label: "Contents",
      type: "string[]",
      description: "A list of JSON-stringified objects that contain the product IDs associated with the event plus information about the products. Available fields: id, quantity, item_price, delivery_category",
      optional: true,
    },
    currency: {
      label: "Currency",
      type: "string",
      description: "**Required** for purchase events. The currency for the value specified, if applicable. Currency must be a valid [ISO 4217 three-digit currency code](https://en.wikipedia.org/wiki/ISO_4217). Example: `USD`",
      optional: true,
    },
    deliveryCategory: {
      label: "Delivery Category",
      type: "string",
      description: "Optional for purchase events. Type of delivery for a purchase event.",
      optional: true,
      options: PURCHASE_EVENT_DELIVERY_CATEGORIES,
    },
    numItems: {
      label: "Number of items",
      type: "string",
      description: "Use **only** with `InitiateCheckout` events. The number of items that a user tries to buy during checkout. Example: `4`",
      optional: true,
    },
    orderId: {
      label: "Order ID",
      type: "string",
      description: "The order ID for this transaction as a string. Example: `order1234`",
      optional: true,
    },
    predictedLtv: {
      label: "Predicted LTV",
      type: "string",
      description: "The predicted lifetime value of a conversion event. Example: `432.12`",
      optional: true,
    },
    searchString: {
      label: "Search String",
      type: "string",
      description: "Use **only** with `Search` events. A search query made by a user. Example: `lettuce`",
      optional: true,
    },
    status: {
      label: "Status",
      type: "string",
      description: "Use **only** with `CompleteRegistration` events. The status of the registration event as a string. Example: `registered`",
      optional: true,
    },
    value: {
      label: "value",
      type: "string",
      description: "**Required** for purchase events. A numeric value associated with this event. This could be a monetary value or a value in some other metric. Example: `142.54`",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      contentCategory,
      contentIds,
      contentName,
      contentType,
      currency,
      deliveryCategory,
      numItems,
      orderId,
      predictedLtv,
      searchString,
      status,
      value,
    } = this;

    let contents: object[];
    try {
      contents = this.contents?.map((str: string) => JSON.parse(str));
    } catch (err) {
      throw new ConfigurationError("Error parsing the `contents` prop - make sure its value are proper JSON-stringified objects.");
    }

    const obj = Object.fromEntries(Object.entries({
      content_category: contentCategory,
      content_ids: contentIds,
      content_name: contentName,
      content_type: contentType,
      contents,
      currency,
      delivery_category: deliveryCategory,
      num_items: numItems,
      order_id: orderId,
      predicted_ltv: predictedLtv,
      search_string: searchString,
      status,
      value,
    }).filter(([
      , v,
    ]) => v !== undefined));

    $.export("$summary", "Successfully built custom data");
    return obj;
  },
});
