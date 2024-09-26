import cloudinary from "../../cloudinary.app.mjs";

export default {
  key: "cloudinary-get-account-usage-details",
  name: "Get Account Usage Details",
  description: "Enables you to get a report on the status of your Cloudinary account usage details, including storage, credits, bandwidth, requests, number of resources, and add-on usage. [See the documentation](https://cloudinary.com/documentation/admin_api#usage)",
  version: "0.1.2",
  type: "action",
  props: {
    cloudinary,
    date: {
      type: "string",
      label: "Date",
      description: "The date for the usage report. Must be within the last 3 months and given in the format: `dd-mm-yyyy`. Default: the current date",
      optional: true,
    },
  },
  async run({ $ }) {
    const options = {
      date: this.date,
    };

    const response = await this.cloudinary.getUsage(options);

    if (response) {
      $.export("$summary", "Successfully retrieved usage details.");
    }

    return response;
  },
};
