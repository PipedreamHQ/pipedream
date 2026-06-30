import app from "../../tiktok_ads_manager.app.mjs";

export default {
  key: "tiktok_ads_manager-send-conversion-event",
  name: "Send Conversion Event",
  description:
    "Send a server-side web conversion event to TikTok via the Events API."
    + " Use this to report purchases, sign-ups, and other conversions without relying on browser-side tracking."
    + " `pixel_id` is the TikTok Pixel ID found in Events Manager — not the same as `advertiser_id`."
    + " Standard event names: `Purchase`, `CompleteRegistration`, `ViewContent`, `AddToCart`, `InitiateCheckout`, `Subscribe`, `Contact`, `Download`."
    + " User identifiers (`email`, `phone_number`, `external_id`) must be SHA256-hashed before passing."
    + " `timestamp` uses ISO 8601 format (e.g., `2024-01-15T19:49:27Z`). Defaults to current time if omitted."
    + " [See the documentation](https://business-api.tiktok.com/portal/docs/report-web-events-in-bulk/v1.3)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    pixelId: {
      type: "string",
      label: "Pixel ID",
      description: "Your TikTok Pixel ID (`pixel_code`). Find it in TikTok Events Manager under Assets → Events → Website Pixel. This is different from your advertiser ID.",
    },
    event: {
      type: "string",
      label: "Event Name",
      description: "Conversion event name. Standard values: `Purchase`, `CompleteRegistration`, `ViewContent`, `AddToCart`, `InitiateCheckout`, `Subscribe`, `Contact`, `Download`. Custom event names are also accepted.",
    },
    eventId: {
      type: "string",
      label: "Event ID",
      description: "Unique identifier for this event to prevent duplicates. Format: `{UniqueID}_RandomNumber` e.g. `OrderID_357` or `SessionID_892`. If omitted, deduplication is not applied.",
      optional: true,
    },
    timestamp: {
      type: "string",
      label: "Timestamp",
      description: "Time the event occurred in ISO 8601 format. Example: `2024-01-15T19:49:27Z`. Defaults to current time if omitted.",
      optional: true,
    },
    value: {
      type: "string",
      label: "Order Value",
      description: "Total monetary value of the conversion (total order, not per-item). Required for `Purchase` events. Example: `99.99`.",
      optional: true,
    },
    currency: {
      type: "string",
      label: "Currency",
      description: "ISO 4217 currency code. Required when `value` is set. Example: `USD`, `EUR`, `GBP`.",
      optional: true,
    },
    email: {
      type: "string",
      label: "Hashed Email",
      description: "SHA256-hashed email address (lowercase before hashing). Do NOT pass plaintext.",
      optional: true,
    },
    phoneNumber: {
      type: "string",
      label: "Hashed Phone Number",
      description: "SHA256-hashed phone number. Include country code with `+` (e.g., `+12025551234`) before hashing. Do NOT pass plaintext.",
      optional: true,
    },
    externalId: {
      type: "string",
      label: "External ID",
      description: "SHA256-hashed unique identifier from your system (e.g., loyalty ID, user ID). Helps match events to TikTok users.",
      optional: true,
    },
    pageUrl: {
      type: "string",
      label: "Page URL",
      description: "URL of the page where the event occurred. Example: `https://example.com/checkout/confirmation`.",
      optional: true,
    },
    ipAddress: {
      type: "string",
      label: "IP Address",
      description: "Non-hashed public IP address of the user's browser (IPv4 or IPv6). Sending this alongside `user_agent` increases match rates.",
      optional: true,
    },
    userAgent: {
      type: "string",
      label: "User Agent",
      description: "Non-hashed user agent string from the user's browser. Sending this alongside `ip_address` increases match rates.",
      optional: true,
    },
  },
  async run({ $ }) {
    const batchEvent = {
      type: "track",
      event: this.event,
      event_id: this.eventId,
      timestamp: this.timestamp || new Date().toISOString(),
      context: {
        user: {
          email: this.email,
          phone_number: this.phoneNumber,
          external_id: this.externalId,
        },
        page: {
          url: this.pageUrl,
        },
        ip: this.ipAddress,
        user_agent: this.userAgent,
      },
      properties: {
        value: this.value
          ? parseFloat(this.value)
          : undefined,
        currency: this.currency,
      },
    };

    const response = await this.app.sendConversionEvent({
      $,
      data: {
        pixel_code: this.pixelId,
        batch: [
          batchEvent,
        ],
      },
    });

    $.export("$summary", `Sent ${this.event} conversion event to pixel ${this.pixelId}`);
    return response;
  },
};
