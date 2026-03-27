// vandelay-test-dr
import app from "../../app/beehiiv.app";
import { defineAction } from "@pipedream/types";

export default defineAction({
  key: "beehiiv-create-subscriber-ai",
  name: "Create Subscriber (AI)",
  description:
    "Create a new subscriber for a publication."
    + " Use **List Custom Fields** to discover available custom"
    + " field names before passing `customFields`."
    + " Use **Get Publication Info** to get the publication ID."
    + " Set `reactivateExisting: true` to re-subscribe someone"
    + " who previously unsubscribed."
    + " [See the documentation]"
    + "(https://developers.beehiiv.com/api-reference/"
    + "subscriptions/create)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
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
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the new subscriber.",
    },
    reactivateExisting: {
      type: "boolean",
      label: "Reactivate Existing",
      description:
        "Whether to reactivate the subscriber if they previously"
        + " unsubscribed. Only use if the subscriber is knowingly"
        + " resubscribing. Default: `false`.",
      optional: true,
    },
    sendWelcomeEmail: {
      type: "boolean",
      label: "Send Welcome Email",
      description:
        "Whether to send a welcome email. Default: `false`.",
      optional: true,
    },
    utmSource: {
      type: "string",
      label: "UTM Source",
      description: "The source of the subscriber.",
      optional: true,
    },
    utmMedium: {
      type: "string",
      label: "UTM Medium",
      description: "The medium of the subscriber acquisition.",
      optional: true,
    },
    utmChannel: {
      type: "string",
      label: "UTM Channel",
      description: "The channel of the subscriber acquisition.",
      optional: true,
    },
    referringSite: {
      type: "string",
      label: "Referring Site",
      description: "The URL that referred the subscriber.",
      optional: true,
    },
    customFields: {
      type: "string",
      label: "Custom Fields",
      description:
        "JSON array of custom field name-value pairs."
        + " Example: `[{\"name\": \"role\", \"value\":"
        + " \"Engineer\"}]`."
        + " Use **List Custom Fields** to discover available"
        + " field names.",
      optional: true,
    },
    tier: {
      type: "string",
      label: "Tier",
      description:
        "Subscription tier. `free` for free tier, or the premium"
        + " tier name.",
      optional: true,
    },
  },
  async run({ $ }) {
    const data: Record<string, unknown> = {
      email: this.email,
      publication_id: this.publicationId,
    };

    if (this.reactivateExisting != null) {
      data.reactivate_existing = this.reactivateExisting;
    }
    if (this.sendWelcomeEmail != null) {
      data.send_welcome_email = this.sendWelcomeEmail;
    }
    if (this.utmSource) data.utm_source = this.utmSource;
    if (this.utmMedium) data.utm_medium = this.utmMedium;
    if (this.utmChannel) data.utm_channel = this.utmChannel;
    if (this.referringSite) data.referring_site = this.referringSite;
    if (this.tier) data.tier = this.tier;

    if (this.customFields) {
      try {
        data.custom_fields = typeof this.customFields === "string"
          ? JSON.parse(this.customFields)
          : this.customFields;
      } catch {
        throw new Error(
          "customFields must be a valid JSON array."
          + " Example: [{\"name\": \"role\", \"value\":"
          + " \"Engineer\"}]",
        );
      }
    }

    const response = await this.app.createSubscriber($, data);
    const id = response?.data?.id || "unknown";

    $.export(
      "$summary",
      `Created subscriber ${this.email} (ID: ${id})`,
    );

    return response;
  },
});
