import shopify from "../../shopify.app.mjs";
import { MAX_LIMIT } from "../../common/constants.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "shopify-get-tracking",
  name: "Get Fulfillment Tracking Info",
  description: "Retrieve tracking information for a fulfillment. [See the documentation](https://shopify.dev/docs/api/admin-graphql/latest/queries/fulfillment)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    shopify,
    // eslint-disable-next-line pipedream/props-label, pipedream/props-description
    info: {
      type: "alert",
      alertType: "info",
      content: "Please verify that the Shopify shop has fulfillments properly defined and that your API credentials have been granted this access scope. [See the documentation](https://shopify.dev/docs/api/usage/access-scopes)",
    },
    fulfillmentId: {
      propDefinition: [
        shopify,
        "fulfillmentId",
      ],
    },
  },
  async run({ $ }) {
    let id;
    if (this.fulfillmentId.startsWith("gid://")) {
      if (this.fulfillmentId.split("/")[3] !== "Fulfillment") {
        throw new ConfigurationError(`"${this.fulfillmentId}" is not a Fulfillment GID. Expected format: gid://shopify/Fulfillment/123456789`);
      }
      id = this.fulfillmentId;
    } else {
      id = `gid://shopify/Fulfillment/${this.fulfillmentId}`;
    }
    const { fulfillment } = await this.shopify.getFulfillment({
      id,
      first: MAX_LIMIT,
    });
    if (!fulfillment) {
      throw new Error(`No fulfillment found for fulfillment ID: ${this.fulfillmentId}`);
    }
    $.export("$summary", `Successfully retrieved tracking info for fulfillment \`${fulfillment.id}\``);
    return fulfillment;
  },
};
