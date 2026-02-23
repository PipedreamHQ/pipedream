import enrichlayer from "../../enrichlayer.app.mjs";

export default {
  key: "enrichlayer-get-reverse-contact-number-lookup",
  name: "Get Reverse Contact Number Lookup",
  description: "Find social media profiles from a contact phone number. Cost: 3 credits per successful request. [See the docs](https://enrichlayer.com/docs).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    enrichlayer,
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "E.164 formatted phone number (e.g., `+14155552671`).",
    },
  },
  async run({ $ }) {
    const response = await this.enrichlayer._makeRequest({
      $,
      path: "/api/v2/resolve/phone",
      params: {
        phone_number: this.phoneNumber,
      },
    });
    $.export("$summary", `Successfully resolved profiles for phone number ${this.phoneNumber}`);
    return response;
  },
};
