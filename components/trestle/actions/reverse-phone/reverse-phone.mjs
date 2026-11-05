import app from "../../trestle.app.mjs";

export default {
  key: "trestle-reverse-phone",
  name: "Reverse Phone",
  description: "Offers comprehensive verification and enrichment of phone numbers. [See the documentation](https://docs.trestleiq.com/api-reference/reverse-phone-api)",
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
    const response = await this.app.reversePhone({
      $,
      params: {
        phone: this.phone,
      },
    });
    $.export("$summary", "Successfully executed reverse phone lookup");
    return response;
  },
};
