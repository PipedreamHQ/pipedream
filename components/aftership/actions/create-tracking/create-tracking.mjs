import { ConfigurationError } from "@pipedream/platform";
import aftership from "../../aftership.app.mjs";

export default {
  key: "aftership-create-tracking",
  name: "Create Tracking",
  description: "Creates a tracking. [See the documentation](https://www.aftership.com/docs/api/4/trackings/post-trackings)",
  version: "0.0.1",
  type: "action",
  props: {
    aftership,
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
      optional: true,
    },
    title: {
      propDefinition: [
        aftership,
        "title",
      ],
      optional: true,
    },
    smses: {
      propDefinition: [
        aftership,
        "smses",
      ],
      optional: true,
    },
    emails: {
      propDefinition: [
        aftership,
        "emails",
      ],
      optional: true,
    },
    customerName: {
      propDefinition: [
        aftership,
        "customerName",
      ],
      optional: true,
    },
    destinationCountryIso3: {
      propDefinition: [
        aftership,
        "destinationCountryIso3",
      ],
      optional: true,
    },
    orderId: {
      propDefinition: [
        aftership,
        "orderId",
      ],
      optional: true,
    },
    orderIdPath: {
      propDefinition: [
        aftership,
        "orderIdPath",
      ],
      optional: true,
    },
    customFields: {
      propDefinition: [
        aftership,
        "customFields",
      ],
      optional: true,
    },
    orderNumber: {
      propDefinition: [
        aftership,
        "orderNumber",
      ],
      optional: true,
    },
    language: {
      propDefinition: [
        aftership,
        "language",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    if (this.trackingNumber.length < 4 || this.trackingNumber.length > 100) {
      throw new ConfigurationError("We only accept tracking numbers with length from 4 to 100");
    }
    const response = await this.aftership.createTracking({
      tracking: {
        tracking_number: this.trackingNumber,
        slug: this.slug,
        title: this.title,
        order_id: this.orderId,
        order_id_path: this.orderIdPath,
        order_number: this.orderNumber,
        custom_fields: this.customFields,
        language: this.language,
        smses: this.smses,
        emails: this.emails,
        customer_name: this.customerName,
        destination_country_iso3: this.destinationCountryIso3,
      },
    });

    $.export("$summary", `Successfully created tracking with ID ${response.data.tracking.id}`);
    return response;
  },
};
