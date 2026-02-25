import bolCom from "../../bol_com.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "bol_com-list-invoice-requests",
  name: "List Invoice Requests",
  description: "List invoice requests. [See the documentation](https://api.bol.com/retailer/public/redoc/v10/retailer.html#tag/Shipments/operation/get-invoice-requests)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    bolCom,
    shipmentId: {
      propDefinition: [
        bolCom,
        "shipmentId",
      ],
    },
    page: {
      propDefinition: [
        bolCom,
        "page",
      ],
    },
    state: {
      type: "string",
      label: "State",
      description: "To filter on invoice request state. You can filter on all invoice requests regardless their statuses, open invoice requests requiring your action and invoice requests uploaded with possible errors.",
      options: constants.INVOICE_REQUEST_STATE_OPTIONS,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.bolCom.listInvoiceRequests({
      $,
      params: {
        "shipment-id": this.shipmentId,
        "state": this.state,
        "page": this.page,
      },
    });
    $.export("$summary", `Successfully retrieved ${response.invoiceRequests.length} invoice request${response.invoiceRequests.length === 1
      ? ""
      : "s"}`);
    return response;
  },
};
