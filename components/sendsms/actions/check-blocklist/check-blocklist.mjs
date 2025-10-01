import sendsms from "../../sendsms.app.mjs";

export default {
  key: "sendsms-check-blocklist",
  name: "Check Blocklist",
  description: "Checks if a specific phone number is in the blocklist. [See the documentation](https://www.sendsms.ro/api/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    sendsms,
    phoneNumber: {
      type: "integer",
      label: "Phone Number to Check",
      description: "The phone number to check in the blocklist, in E.164 format without the + sign (e.g., 40727363767).",
    },
  },
  async run({ $ }) {
    const response = await this.sendsms.checkBlocklist({
      $,
      params: {
        phonenumber: this.phoneNumber,
      },
    });

    if (response.status < 0) {
      throw new Error(response.message);
    }

    $.export("$summary", `The phone number ${this.phoneNumber} is ${response.message}`);
    return response;
  },
};
