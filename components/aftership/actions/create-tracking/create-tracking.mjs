import aftership from "../../aftership.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "aftership-create-tracking",
  name: "Create Tracking",
  description: "Creates a tracking. [See the documentation](https://www.aftership.com/docs/api/4/trackings/post-trackings)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    aftership,
    trackingNumber: {
      type: "string",
      label: "Tracking Number",
      description: "The tracking number of the shipment",
    },
    slug: {
      type: "string",
      label: "Slug",
      description: "The unique code of the courier",
      optional: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "Title of the tracking",
      optional: true,
    },
    smses: {
      type: "string[]",
      label: "SMSes",
      description: "An array of phone numbers subscribed to receive SMS notifications",
      optional: true,
    },
    emails: {
      type: "string[]",
      label: "Emails",
      description: "An array of emails subscribed to receive email notifications",
      optional: true,
    },
    customerName: {
      type: "string",
      label: "Customer Name",
      description: "The name of the customer",
      optional: true,
    },
    destinationCountryIso3: {
      type: "string",
      label: "Destination Country ISO3",
      description: "The ISO Alpha-3 (three-letter) country code of the destination",
      optional: true,
    },
    orderId: {
      type: "string",
      label: "Order ID",
      description: "The order ID of the shipment",
      optional: true,
    },
    orderIdPath: {
      type: "string",
      label: "Order ID Path",
      description: "The tracking URL of the order",
      optional: true,
    },
    customFields: {
      type: "object",
      label: "Custom Fields",
      description: "Custom fields that users can set for the tracking",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      tracking: {
        tracking_number: this.trackingNumber,
        slug: this.slug,
        title: this.title,
        smses: this.smses,
        emails: this.emails,
        customer_name: this.customerName,
        destination_country_iso3: this.destinationCountryIso3,
        order_id: this.orderId,
        order_id_path: this.orderIdPath,
        custom_fields: this.customFields,
      },
    };

    const response = await this.aftership.createTracking(data);
    $.export("$summary", `Successfully created tracking with ID ${response.tracking.id}`);
    return response;
  },
};
