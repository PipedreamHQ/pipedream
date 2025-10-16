import app from "../../workbooks_crm.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "workbooks_crm-create-customer-order",
  name: "Create Customer Order",
  description: "Creates an order from your customers for your goods or services.",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    assignedTo: {
      label: "Assigned To",
      description: "A queue that this Customer Order could be assigned to.",
      propDefinition: [
        app,
        "orderQueue",
      ],
    },
    description: {
      type: "string",
      label: "Customer Order Name",
      description: "The description of this Customer Order.",
    },
    documentCurrency: {
      type: "string",
      label: "Document Currency",
      description: "The currency of this Transaction in [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217) format. E.g. `USD`.",
    },
    documentDate: {
      type: "string",
      label: "Customer Order Date",
      description: "The official date for this Customer Order.",
      default: utils.getCurrentDate(),
    },
    status: {
      type: "string",
      label: "Status",
      description: "The status of this Transaction.",
      default: "DRAFT",
    },
    taxPointDate: {
      type: "string",
      label: "Tax Point Date",
      description: "The date that sales tax will be calculated for this Transaction.",
      default: utils.getCurrentDate(),
    },
  },
  async run({ $: step }) {
    const {
      assignedTo,
      description,
      documentCurrency,
      documentDate,
      status,
      taxPointDate,
    } = this;

    const response = await this.app.createOrder({
      step,
      data: {
        assigned_to: [
          assignedTo,
        ],
        description: [
          description,
        ],
        document_currency: [
          documentCurrency,
        ],
        document_date: [
          documentDate,
        ],
        status: [
          status,
        ],
        tax_point_date: [
          taxPointDate,
        ],
      },
    });

    step.export("$summary", `Successfully created customer order with ID ${response.affected_objects[0].id}`);

    return response;
  },
};
