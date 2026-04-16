import app from "../../consulta_unica.app.mjs";

export default {
  key: "consulta_unica-validate-rfc",
  name: "Validate RFC",
  description: "Validates a Mexican Federal Taxpayer Registry (RFC) number. Returns the RFC and its validation status. [See the documentation](https://consultaunica-docs.vercel.app/services/sat/rfc_validation.html)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    rfc: {
      propDefinition: [
        app,
        "rfc",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      rfc,
    } = this;

    const response = await app.validateRfc({
      $,
      data: {
        variant: "rfc_validation",
        rfcValidation: {
          rfc,
        },
      },
    });

    $.export("$summary", "Successfully validated RFC");
    return response;
  },
};
