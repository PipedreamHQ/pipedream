import app from "../../consulta_unica.app.mjs";

export default {
  key: "consulta_unica-get-afore-details",
  name: "Get Afore Details",
  description: "Retrieves pension fund (Afore) account details using a Mexican citizen's CURP identification number. Returns Afore provider, contact information, and account status. [See the documentation](https://consultaunica-docs.vercel.app/services/afore/get_only_details.html)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    curp: {
      propDefinition: [
        app,
        "curp",
      ],
    },
  },
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  async run({ $ }) {
    const {
      app,
      curp,
    } = this;

    const response = await app.getAforeDetails({
      $,
      data: {
        variant: "encrypt",
        curp,
      },
    });

    $.export("$summary", "Successfully retrieved Afore details");
    return response;
  },
};
