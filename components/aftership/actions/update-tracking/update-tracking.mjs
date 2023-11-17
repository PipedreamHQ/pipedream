import aftership from "../../aftership.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "aftership-update-tracking",
  name: "Update Tracking",
  description: "Updates an existing tracking. [See the documentation](https://www.aftership.com/docs/api/4/trackings/put-trackings-slug-tracking_number)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    aftership,
    trackingId: {
      propDefinition: [
        aftership,
        "trackingId",
        (c) => ({
          page: c.page || 1,
        }), // Using an arrow function to pass the page context
      ],
    },
    trackingNumber: {
      propDefinition: [
        aftership,
        "trackingNumber",
      ],
    },
    slug: {
      propDefinition: [
        aftership,
        "slug",
      ],
    },
    title: {
      propDefinition: [
        aftership,
        "title",
      ],
    },
    smses: {
      propDefinition: [
        aftership,
        "smses",
      ],
    },
    emails: {
      propDefinition: [
        aftership,
        "emails",
      ],
    },
    customerName: {
      propDefinition: [
        aftership,
        "customerName",
      ],
    },
    destinationCountryIso3: {
      propDefinition: [
        aftership,
        "destinationCountryIso3",
      ],
    },
    orderId: {
      propDefinition: [
        aftership,
        "orderId",
      ],
    },
    orderIdPath: {
      propDefinition: [
        aftership,
        "orderIdPath",
      ],
    },
    customFields: {
      propDefinition: [
        aftership,
        "customFields",
      ],
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

    // Remove undefined keys from data
    Object.keys(data.tracking).forEach((key) => data.tracking[key] === undefined && delete data.tracking[key]);

    const response = await this.aftership.updateTracking(this.trackingId, data);
    $.export("$summary", `Successfully updated tracking with ID ${this.trackingId}`);
    return response;
  },
};
