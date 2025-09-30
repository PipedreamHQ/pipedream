import veriphone from "../../veriphone.app.mjs";

export default {
  key: "veriphone-get-phone-example",
  name: "Get Dummy Phone Number",
  description: "Returns a dummy phone number for a specific country and phone type. [See the documentation](https://veriphone.io/docs/v2#:~:text=T%2DMobile%22%0A%7D-,EXAMPLE,-Veriphone%27s%20/v2/example)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    veriphone,
    countryCode: {
      propDefinition: [
        veriphone,
        "countryCode",
      ],
      optional: true,
    },
    phoneType: {
      propDefinition: [
        veriphone,
        "phoneType",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.veriphone.getDummyPhoneNumber({
      $,
      params: {
        country_code: this.countryCode,
        type: this.phoneType,
      },
    });

    $.export("$summary", `Retrieved dummy phone number for country ${response.country_code} and type ${this.phoneType}`);
    return response;
  },
};
