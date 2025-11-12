import addresszen from "../../addresszen.app.mjs";

export default {
  key: "addresszen-verify-correct-us-address-zip-code",
  name: "Verify and Correct US Address by Zip Code",
  description: "Verifies and corrects a US address based on a single address line and a zip code. [See the documentation](https://docs.addresszen.com/docs/api)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    addresszen,
    addressLine: {
      propDefinition: [
        addresszen,
        "addressLine",
      ],
    },
    zipCode: {
      propDefinition: [
        addresszen,
        "zipCode",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.addresszen.verifyAddress({
      $,
      data: {
        query: this.addressLine,
        zip_code: this.zipCode,
      },
    });
    $.export("$summary", "Successfully verified and corrected the address");
    return response;
  },
};
