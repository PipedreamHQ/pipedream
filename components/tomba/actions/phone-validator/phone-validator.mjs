import app from "../../tomba.app.mjs";

export default {
  key: "tomba-phone-validator",
  name: "Phone Validator",
  description:
    "Validate a phone number and retrieve its associated information. [See the documentation](https://tomba.io/api)",
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
    const response = await this.app.phoneValidator({
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
