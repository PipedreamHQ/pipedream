import shopify_partner from "../../shopify_partner.app.mjs";
import crypto from "crypto";

export default {
  name: "Verify Webhook",
  version: "0.0.8",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  key: "shopify_partner-verify-webhook",
  description:
    "Verify an incoming webhook from Shopify. Exits the workflow if the signature is not valid, otherwise returns `true`",
  props: {
    shopify_partner,
    appSecretKey: {
      type: "string",
      secret: true,
      label: "App API secret key",
      description:
        "The secret key associated with the Shopify App receiving the webhook.",
    },
    shopifyHmac: {
      type: "string",
      label: "Shopify HMAC Signature",
      description:
        "The value of the `x-shopify-hmac-sha256` webhook request header. Use `{{steps.trigger.event.headers['x-shopify-hmac-sha256']}}` to reference the header from the HTTP trigger",
    },
    body: {
      type: "any",
      label: "Webhook Body",
      description:
        "The incoming webhook payload. Use `{{ steps.trigger.event.body }}` to reference the request body from the HTTP trigger.",
    },
  },
  type: "action",
  methods: {},
  async run({ $ }) {
    // Webhook documentation on shape, etc.
    // https://shopify.dev/apps/webhooks/configuration/mandatory-webhooks
    const body = this.body;
    const shopifyHmac = this.shopifyHmac;

    // verify webhook origin
    const hash = crypto
      .createHmac("sha256", this.appSecretKey)
      .update(Buffer.from(JSON.stringify(body)))
      .digest("base64");

    if (hash !== shopifyHmac) {
      console.log("Invalid webhook signature, unauthorized");
      console.log(shopifyHmac, hash);
      if ($.flow) {
        return $.flow.exit("Invalid webhook signature.");
      } else {
        throw new Error("Invalid webhook signature.");
      }
    }

    return true;
  },
};
