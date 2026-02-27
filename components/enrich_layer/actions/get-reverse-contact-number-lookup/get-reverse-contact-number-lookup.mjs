import enrichlayer from "../../enrich_layer.app.mjs";

export default {
  key: "enrich_layer-get-reverse-contact-number-lookup",
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
    const response = await this.enrichlayer.getReverseContactNumberLookup({
      $,
      params: {
        phone_number: this.phoneNumber,
      },
    });
    $.export("$summary", "Successfully resolved profiles for phone number");
    return response;
  },
};
