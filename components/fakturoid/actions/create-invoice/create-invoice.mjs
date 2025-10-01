import constants, { parseObject } from "../../common/constants.mjs";
import fakturoid from "../../fakturoid.app.mjs";

export default {
  key: "fakturoid-create-invoice",
  name: "Create Invoice",
  description: "Creates a new invoice. [See the documentation](https://www.fakturoid.cz/api/v3/invoices)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    fakturoid,
    accountSlug: {
      propDefinition: [
        fakturoid,
        "accountSlug",
      ],
    },
    customId: {
      type: "string",
      label: "Custom Id",
      description: "Identifier in your application",
      optional: true,
    },
    documentType: {
      type: "string",
      label: "Document Type",
      description: "Type of document",
      options: constants.DOCUMENT_TYPE_OPTIONS,
      reloadProps: true,
      optional: true,
    },
    subjectId: {
      propDefinition: [
        fakturoid,
        "subjectId",
        ({ accountSlug }) => ({
          accountSlug,
        }),
      ],
    },
    orderNumber: {
      type: "string",
      label: "Order Number",
      description: "Order number in your application",
      optional: true,
    },
    note: {
      type: "string",
      label: "Note",
      description: "Additional notes for the invoice",
      optional: true,
    },
    due: {
      type: "string",
      label: "Due",
      description: "Invoice due date in number of days from today",
      optional: true,
    },
    issuedOn: {
      type: "string",
      label: "Issued On",
      description: "Date of issue. **Format: YYYY-MM-DD**",
      optional: true,
    },
    taxableFulfillmentDue: {
      type: "string",
      label: "Taxable Fulfillment Due",
      description: "Chargeable event date.",
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "List of tags",
      optional: true,
    },
    roundTotal: {
      type: "boolean",
      label: "Round Total",
      description: "Round total amount (VAT included)",
      optional: true,
    },
    subtotal: {
      type: "string",
      label: "Subtotal",
      description: "Total without VAT",
      optional: true,
    },
    total: {
      type: "string",
      label: "Total",
      description: "Total with VAT",
      optional: true,
    },
    lines: {
      type: "string[]",
      label: "Lines",
      description: "List of object lines to invoice. [See the documentation](https://www.fakturoid.cz/api/v3/invoices#attributes). **Example: {\"name\": \"Hard work\",\"quantity\": \"1.0\",\"unit_name\": \"h\",\"unit_price\": \"40000\",\"vat_rate\": \"21\"}**",
    },
  },
  async additionalProps() {
    const props = {};
    if (this.documentType === "proforma") {
      props.proformaFollowupDocument = {
        type: "string",
        label: "Proforma Followup Document",
        description: "What to issue after a proforma is paid.",
        options: constants.PROFORMA_OPTIONS,
        optional: true,
      };
    }
    return props;
  },
  async run({ $ }) {
    const response = await this.fakturoid.createInvoice({
      $,
      accountSlug: this.accountSlug,
      data: {
        custom_id: this.customId,
        document_type: this.documentType,
        proforma_followup_document: this.proformaFollowupDocument,
        subject_id: this.subjectId,
        order_number: this.orderNumber,
        note: this.note,
        due: this.due,
        issued_on: this.issuedOn,
        taxable_fulfillment_due: this.taxableFulfillmentDue,
        tags: parseObject(this.tags),
        round_total: this.roundTotal,
        subtotal: this.subtotal && parseFloat(this.subtotal),
        total: this.total && parseFloat(this.total),
        lines: parseObject(this.lines),
      },
    });

    $.export("$summary", `Successfully created invoice with ID ${response.id}`);
    return response;
  },
};
