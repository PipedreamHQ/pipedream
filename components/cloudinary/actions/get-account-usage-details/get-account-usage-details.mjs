import cloudinary from "../../cloudinary.app.mjs";

export default {
  key: "cloudinary-get-account-usage-details",
  name: "Get Account Usage Details",
  description: "Gets a report of your Cloudinary account usage details, including storage, credits, bandwidth, requests, number of resources, and add-on usage. [See the documentation](https://cloudinary.com/documentation/admin_api#usage)",
  version: "0.2.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    cloudinary,
    dateInfo: {
      type: "alert",
      alertType: "info",
      content: "If `Date` is not specified, it defaults to the current date.",
    },
    date: {
      type: "string",
      label: "Date",
      description: "The date for the usage report, in the `yyyy-mm-dd` format, e.g. `2019-07-21`. Must be between yesterday and the last 3 months.",
      optional: true,
    },
  },
  async run({ $ }) {
    const options = {
      date: this.date,
    };

    try {
      const response = await this.cloudinary.getUsage(options);

      if (response) {
        $.export("$summary", "Successfully retrieved usage details");
      }

      return response;
    }
    catch (err) {
      throw new Error(`Cloudinary error response: ${err.error?.message ?? JSON.stringify(err)}`);
    }
  },
};
