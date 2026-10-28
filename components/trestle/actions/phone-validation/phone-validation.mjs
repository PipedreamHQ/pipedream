import app from "../../trestle.app.mjs";

export default {
  key: "trestle-phone-validation",
  name: "Phone Validation",
  description: "Validates phone numbers and provides phone metadata. [See the documentation](https://docs.trestleiq.com/api-reference/phone-validation-api)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    phone: {
      propDefinition: [
        app,
        "phone",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.phoneValidation({
      $,
      params: {
        phone: this.phone,
      },
    });
    $.export("$summary", "Successfully executed phone validation");
    return response;
  },
};
