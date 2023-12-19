import { ConfigurationError } from "@pipedream/platform";
import common from "../common.mjs";

export default {
  ...common,
  key: "aftership-create-tracking",
  name: "Create Tracking",
  description: "Creates a tracking. [See the documentation](https://www.aftership.com/docs/api/4/trackings/post-trackings)",
  version: "0.1.0",
  type: "action",
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
