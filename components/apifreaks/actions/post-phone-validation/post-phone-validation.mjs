import app from "../../apifreaks.app.mjs";

export default {
  key: "apifreaks-post-phone-validation",
  name: "Validate a Single Phone Number",
  description: "Validates a single phone number and returns detailed metadata including carrier, line type, geolocation, time zones, and standardized formats. [See the documentation](https://apifreaks.com/docs).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    number: {
      type: "string",
      label: "Number",
      description: "Phone number to validate. Accepts international format (+14155552671), local format (4155552671) with region, or IDD format (0014155552671) with dialer_region.",
      optional: false,
    },
    region: {
      type: "string",
      label: "Region",
      description: "Two-letter ISO country code (e.g., US, GB). Required when number is in local format without + prefix. Cannot be used together with dialer_region.",
      optional: true,
    },
    dialerRegion: {
      type: "string",
      label: "Dialer Region",
      description: "Two-letter ISO country code indicating the country the number is being dialed from. Required when number uses IDD exit code. Cannot be used together with region.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app._makeRequest({
      $,
      method: "POST",
      path: "/v1.0/phone/validation",
      data: {
        number: this.number,
        region: this.region,
        "dialer_region": this.dialerRegion,
      },
    });
    $.export("$summary", "Successfully executed Validate a Single Phone Number");
    return response;
  },
};
