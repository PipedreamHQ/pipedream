import app from "../../tomba.app.mjs";

export default {
  key: "tomba-validate-phone",
  name: "Validate Phone",
  description:
    "Validate a phone number and retrieve its associated information. [See the documentation](https://docs.tomba.io/api/phone#phone-validator)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    phoneNumber: {
      propDefinition: [
        app,
        "phoneNumber",
      ],
    },
    country: {
      propDefinition: [
        app,
        "country",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.validatePhone({
      $,
      phoneNumber: this.phoneNumber,
      country: this.country,
    });

    $.export(
      "$summary",
      `Successfully validated phone number: ${this.phoneNumber}`,
    );
    return response;
  },
};
