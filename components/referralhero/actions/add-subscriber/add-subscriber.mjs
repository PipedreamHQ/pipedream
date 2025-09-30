import referralhero from "../../referralhero.app.mjs";

export default {
  key: "referralhero-add-subscriber",
  name: "Add Subscriber",
  description: "Adds a new subscriber to to a list. [See the documentation](https://support.referralhero.com/integrate/rest-api/endpoints-reference#add-a-subscriber)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    referralhero,
    listId: {
      propDefinition: [
        referralhero,
        "listId",
      ],
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email address of the subscriber",
    },
    domain: {
      type: "string",
      label: "Domain",
      description: "The URL for the referral link",
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name of the subscriber",
      optional: true,
    },
    doubleOptin: {
      type: "boolean",
      label: "Double Opt-in",
      description: "If set to `false`, the subscriber will not receive a confirmation email",
      default: true,
      optional: true,
    },
    source: {
      type: "string",
      label: "Source",
      description: "The source of the subscriber. Used for analytics.",
      optional: true,
    },
    referrer: {
      type: "boolean",
      label: "Referrer",
      description: "Set a referrer for the subscriber by providing the referrer's referral code or email",
      optional: true,
    },
    conversionValue: {
      type: "string",
      label: "Conversion Value",
      description: "The monetary value of the referral",
      optional: true,
    },
    pending: {
      type: "boolean",
      label: "Pending",
      description: "Set to `true` to set the referral status to pending",
      default: false,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.referralhero.addSubscriber({
      listId: this.listId,
      params: {
        email: this.email,
        name: this.name,
        double_optin: this.doubleOptin,
        source: this.source,
        referrer: this.referrer,
        domain: this.domain,
        conversion_value: this.conversionValue,
        status: this.pending
          ? "custom_event_pending"
          : undefined,
      },
      $,
    });

    if (response?.status === "error") {
      throw new Error(response.message);
    }

    if (response?.data?.id) {
      $.export("$summary", `Successfully added subscriber with ID ${response.data.id}.`);
    }

    return response;
  },
};
