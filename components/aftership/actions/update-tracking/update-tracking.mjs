import aftership from "../../aftership.app.mjs";
import common from "../common.mjs";

export default {
  key: "aftership-update-tracking",
  name: "Update Tracking",
  description: "Updates an existing tracking. [See the documentation](https://www.aftership.com/docs/api/4/trackings/put-trackings-slug-tracking_number)",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    trackingId: {
      propDefinition: [
        aftership,
        "trackingId",
      ],
    },
  },
  async run({ $ }) {
    const data = {
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
    };
    // Remove undefined keys from data
    Object.keys(data.tracking)
      .forEach((key) => data.tracking[key] === undefined && delete data.tracking[key]);

    const response = await this.aftership.updateTracking({
      trackingId: this.trackingId,
      data,
    });
    $.export("$summary", `Successfully updated tracking with ID ${this.trackingId}`);
    return response;
  },
};
