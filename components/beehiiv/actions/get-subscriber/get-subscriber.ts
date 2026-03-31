// vandelay-test-dr
import app from "../../app/beehiiv.app";
import { defineAction } from "@pipedream/types";

export default defineAction({
  key: "beehiiv-get-subscriber",
  name: "Get Subscriber",
  description:
    "Get full details for a single subscriber by ID or email."
    + " Use `expand` to include stats (open/click rates), custom"
    + " field values, or referral data."
    + " Either `subscriptionId` or `email` must be provided."
    + " Use **Search Subscribers** to find subscriber IDs."
    + " Use **Get Publication Info** to get the publication ID."
    + " [See the documentation]"
    + "(https://developers.beehiiv.com/api-reference/"
    + "subscriptions/get-by-id)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    publicationId: {
      type: "string",
      label: "Publication ID",
      description:
        "The publication ID. Use **Get Publication Info** to find"
        + " this.",
    },
    subscriptionId: {
      type: "string",
      label: "Subscription ID",
      description:
        "The subscriber's subscription ID. Use this OR `email`.",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description:
        "The subscriber's email address. Use this OR"
        + " `subscriptionId`.",
      optional: true,
    },
    expand: {
      type: "string[]",
      label: "Expand",
      description:
        "Include additional data. Options: `stats`,"
        + " `custom_fields`, `referrals`,"
        + " `subscription_premium_tiers`.",
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.subscriptionId && !this.email) {
      throw new Error(
        "Either `subscriptionId` or `email` must be provided.",
      );
    }

    const params: Record<string, unknown> = {};
    if (this.expand?.length) params["expand[]"] = this.expand;

    let response;
    if (this.subscriptionId) {
      response = await this.app.getSubscription(
        $,
        this.publicationId,
        this.subscriptionId,
        params,
      );
    } else {
      response = await this.app.getSubscriptionByEmail(
        $,
        this.publicationId,
        this.email,
        params,
      );
    }

    const subscriber = response.data || response;
    const email = subscriber.email || this.email || this.subscriptionId;

    $.export(
      "$summary",
      `Retrieved subscriber: ${email}`,
    );

    return subscriber;
  },
});
