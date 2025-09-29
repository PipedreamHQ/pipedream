import app from "../../postnl.app.mjs";

export default {
  key: "postnl-get-status-by-reference",
  name: "Get Status By Reference",
  description: "Retrieve the status of a shipment using a reference number. [See the documentation](https://developer.postnl.nl/docs/#/http/api-endpoints/send-track/shippingstatus/get-status-by-reference)",
  type: "action",
  version: "0.0.1",
  props: {
    app,
    customerCode: {
      propDefinition: [
        app,
        "customerCode",
      ],
    },
    customerNumber: {
      propDefinition: [
        app,
        "customerNumber",
      ],
    },
    reference: {
      propDefinition: [
        app,
        "referenceId",
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
      customerCode,
      customerNumber,
      reference,
      detail,
      language,
      maxDays,
    } = this;

    const response = await app.getStatusByReference({
      $,
      params: {
        customerCode,
        customerNumber,
        reference,
        detail,
        language,
        maxDays,
      },
    });

    $.export("$summary", "Successfully retrieved status by reference");
    return response;
  },
};
