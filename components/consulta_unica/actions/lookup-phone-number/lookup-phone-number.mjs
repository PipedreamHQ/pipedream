import app from "../../consulta_unica.app.mjs";

export default {
  key: "consulta_unica-lookup-phone-number",
  name: "Lookup Phone Number",
  description: "Looks up information about a Mexican phone number using Ifetel database. Returns phone type (mobile/fixed), carrier, and registration details. [See the documentation](https://consultaunica-docs.vercel.app/services/ifetel.html)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    phoneNumber: {
      propDefinition: [
        app,
        "phoneNumber",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      phoneNumber,
    } = this;

    const response = await app.lookupPhone({
      $,
      data: {
        variant: "ifetel",
        ifetel: {
          phoneNumber,
        },
      },
    });

    $.export("$summary", "Successfully looked up phone number");
    return response;
  },
};
