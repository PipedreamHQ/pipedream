import smsFusion from "../../sms_fusion.app.mjs";

export default {
  key: "sms_fusion-perform-hlr-lookup",
  name: "Perform HLR Lookup",
  description: "Perform HLR on a number with SMS Fusion. [See the documentation](https://docs.smsfusion.com.au/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    smsFusion,
    phoneNumber: {
      propDefinition: [
        smsFusion,
        "phoneNumber",
      ],
      description: "The phone number to lookup in MSISDN format. Example: `61412345678`",
    },
    countryCode: {
      propDefinition: [
        smsFusion,
        "countryCode",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.smsFusion.hlrLookup({
      $,
      params: {
        num: this.phoneNumber,
        cc: this.countryCode,
      },
    });

    if (response.id) {
      $.export("$summary", "Successfully performed HLR Lookup");
    }

    return response;
  },
};
