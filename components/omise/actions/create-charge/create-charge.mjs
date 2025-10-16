import { ConfigurationError } from "@pipedream/platform";
import { parseObject } from "../../common/utils.mjs";
import omiseApp from "../../omise.app.mjs";

export default {
  key: "omise-create-charge",
  name: "Create a New Charge",
  description: "Create a new charge for a specific customer and amount through the OPN platform. [See the documentation](https://docs.opn.ooo/charges-api#create)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    omiseApp,
    amount: {
      propDefinition: [
        omiseApp,
        "amount",
      ],
    },
    currency: {
      propDefinition: [
        omiseApp,
        "currency",
      ],
    },
    authorizationType: {
      type: "string",
      label: "Authorization Type",
      description: "The type of the authorization for the charge.",
      options: [
        "pre_auth",
        "final_auth",
      ],
      optional: true,
    },
    capture: {
      propDefinition: [
        omiseApp,
        "capture",
      ],
      optional: true,
    },
    customer: {
      propDefinition: [
        omiseApp,
        "customerId",
      ],
      optional: true,
    },
    card: {
      propDefinition: [
        omiseApp,
        "card",
        ({ customer }) => ({
          customer,
        }),
      ],
      description: "An unused token identifier to add as a new card to the charge.",
      optional: true,
    },
    description: {
      propDefinition: [
        omiseApp,
        "description",
      ],
      description: "Charge description. Supplying information about a purchase (e.g. number of items, type of items, date of delivery) helps Opn Payments better conduct fraud analysis.",
      optional: true,
    },
    expiresAt: {
      type: "string",
      label: "Expires At",
      description: "UTC datetime of desired charge expiration in [ISO 8601](http://en.wikipedia.org/wiki/ISO_8601) format `(YYYY-MM-DDThh:mm:ssZ)`.",
      optional: true,
    },
    ip: {
      type: "string",
      label: "IP",
      description: "IP address to attach to the charge. Supplying the customer's real IP address helps Opn Payments better conduct fraud analysis. May be IPv4 or IPv6.",
      optional: true,
    },
    metadata: {
      propDefinition: [
        omiseApp,
        "metadata",
      ],
      description: "Custom metadata (e.g. `{\"answer\": 42}`) for charge.",
      optional: true,
    },
    platformFee: {
      type: "object",
      label: "Platform Fee",
      description: "Platform fee object as `fixed` amount and/or `percentage` of charge amount.",
      optional: true,
    },
    returnUri: {
      propDefinition: [
        omiseApp,
        "returnUri",
      ],
      optional: true,
    },
    source: {
      propDefinition: [
        omiseApp,
        "sourceId",
      ],
      optional: true,
    },
    webhookEndpoints: {
      type: "string[]",
      label: "Webhook Endpoints",
      description: "URLs to which charge notifications are to be sent. This field can contain a maximum of two URLs.",
      optional: true,
    },
    zeroInterestInstallments: {
      type: "boolean",
      label: "Zero Interest Installments",
      description: "Whether merchant absorbs the interest for installment payments; must match value in associated source.",
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.card && !this.customer && !this.source) {
      throw new ConfigurationError("`Source` is required if `card` and `customer` are not present.");
    }
    const {
      omiseApp,
      authorizationType,
      expiresAt,
      platformFee,
      returnUri,
      webhookEndpoints,
      zeroInterestInstallments,
      ...data
    } = this;
    const response = await omiseApp.createCharge({
      $,
      data: {
        ...data,
        authorization_type: authorizationType,
        expires_at: expiresAt,
        platform_fee: parseObject(platformFee),
        return_uri: returnUri,
        webhook_endpoints: parseObject(webhookEndpoints),
        zero_interest_installments: zeroInterestInstallments,
      },
    });

    $.export("$summary", `Successfully created a new charge with ID: ${response.id}`);
    return response;
  },
};
