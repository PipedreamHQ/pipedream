import app from "../../postnl.app.mjs";

export default {
  key: "postnl-get-status-by-barcode",
  name: "Get Status By Barcode",
  description: "Retrieve the status of a shipment using its barcode. [See the documentation](https://developer.postnl.nl/docs/#/http/api-endpoints/send-track/shippingstatus/get-status-by-barcode)",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    barcode: {
      propDefinition: [
        app,
        "barcode",
      ],
    },
    detail: {
      propDefinition: [
        app,
        "detail",
      ],
    },
    language: {
      propDefinition: [
        app,
        "language",
      ],
    },
    maxDays: {
      propDefinition: [
        app,
        "maxDays",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      barcode,
      detail,
      language,
      maxDays,
    } = this;

    const response = await app.getStatusByBarcode({
      $,
      barcode,
      params: {
        detail,
        language,
        maxDays,
      },
    });

    $.export("$summary", "Successfully retrieved status by barcode");
    return response;
  },
};
