// vandelay-test-dr
import app from "../../app/beehiiv.app";
import { defineAction } from "@pipedream/types";

export default defineAction({
  key: "beehiiv-update-subscriber",
  name: "Update Subscriber",
  description:
    "Update an existing subscriber's fields or unsubscribe them."
    + " Use **Search Subscribers** or **Get Subscriber** to find"
    + " the subscription ID first."
    + " Use **List Custom Fields** to discover available custom"
    + " field names."
    + " Set `unsubscribe: true` to unsubscribe the subscriber."
    + " Use **Get Publication Info** to get the publication ID."
    + " [See the documentation]"
    + "(https://developers.beehiiv.com/api-reference/"
    + "subscriptions/put)",
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
    subscriptionId: {
      type: "string",
      label: "Subscription ID",
      description:
        "The subscriber's subscription ID. Use **Search"
        + " Subscribers** or **Get Subscriber** to find this.",
    },
    unsubscribe: {
      type: "boolean",
      label: "Unsubscribe",
      description:
        "Set to `true` to unsubscribe this subscriber.",
      optional: true,
    },
    customFields: {
      type: "string",
      label: "Custom Fields",
      description:
        "JSON array of custom field name-value pairs to update."
        + " Example: `[{\"name\": \"role\", \"value\":"
        + " \"Manager\"}]`."
        + " Use **List Custom Fields** to discover available"
        + " field names.",
      optional: true,
    },
  },
  async run({ $ }) {
    const data: Record<string, unknown> = {};

    if (this.unsubscribe != null) {
      data.unsubscribe = this.unsubscribe;
    }

    if (this.customFields) {
      try {
        data.custom_fields = typeof this.customFields === "string"
          ? JSON.parse(this.customFields)
          : this.customFields;
      } catch {
        throw new Error(
          "customFields must be a valid JSON array."
          + " Example: [{\"name\": \"role\", \"value\":"
          + " \"Manager\"}]",
        );
      }
    }

    const response = await this.app.updateSubscription(
      $,
      this.publicationId,
      this.subscriptionId,
      data,
    );

    $.export(
      "$summary",
      `Updated subscriber ${this.subscriptionId}`,
    );

    return response;
  },
});
