import { parseObject } from "../../common/utils.mjs";
import faktoora from "../../faktoora.app.mjs";

export default {
  key: "faktoora-create-invoice",
  name: "Create Invoice",
  description: "Create a new ZUGFeRD/xrechnung invoice. [See the documentation](https://api.faktoora.com/api/v1/api-docs/static/index.html)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    faktoora,
    format: {
      type: "string",
      label: "Format",
      description: "The format of the invoice (ZUGFeRD/xrechnung).",
      options: [
        "zf:1",
        "zf:2",
        "xrechnung",
      ],
    },
    invoiceNumber: {
      propDefinition: [
        faktoora,
        "invoiceNumber",
      ],
    },
    issueDate: {
      type: "string",
      label: "Issue Date",
      description: "The issue date of the invoice (YYYYMMDD).",
    },
    currency: {
      type: "string",
      label: "Currency",
      description: "The currency of the invoice.",
    },
    buyerName: {
      type: "string",
      label: "Buyer Name",
      description: "The name of the buyer.",
    },
    buyerPostcode: {
      type: "string",
      label: "Buyer Postcode",
      description: "Buyer location postcode.",
    },
    buyerStreet: {
      type: "string",
      label: "Buyer Street",
      description: "Buyer location street.",
    },
    buyerCity: {
      type: "string",
      label: "Buyer City",
      description: "Buyer location city.",
    },
    buyerCountry: {
      type: "string",
      label: "Buyer Country",
      description: "Buyer location country.",
    },
    invoiceItems: {
      type: "string[]",
      label: "Invoice Items",
      description: "A list of product objects. E.g. **{\"productId\": \"39887\", \"name\": \"Freezer Z7749\", \"quantity\": \"1\", \"unitCode\": \"C62\", \"price\": 100, \"taxes\": [{\"typeCode\": \"VAT\", \"categoryCode\": \"S\", \"rate\": 16}] }**. For further information about init code [click here](https://www.unece.org/fileadmin/DAM/cefact/recommendations/rec20/rec20_rev3_Annex1e.pdf). For further information about Category Code [click here](https://docs.peppol.eu/poacc/billing/3.0/codelist/UNCL5305/)",
    },
    additionalData: {
      type: "object",
      label: "Additional Data",
      description: "An object to manual input other fields. Please check the fields from [the API doc > POST /invoice > Request Body](https://api.faktoora.com/api/v1/api-docs/static/index.html)",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.faktoora.createInvoice({
      $,
      data: {
        invoices: [
          {
            format: this.format,
            invoiceNumber: this.invoiceNumber,
            issueDate: this.issueDate,
            currency: this.currency,
            buyer: {
              name: this.buyerName,
              postcode: this.buyerPostcode,
              street: this.buyerStreet,
              city: this.buyerCity,
              country: this.buyerCountry,
            },
            invoiceItems: this.invoiceItems && parseObject(this.invoiceItems)
              .map((item, index) => ({
                id: `${index + 1}`,
                product: item,
              })),
            ...(parseObject(this.additionalData) || {}),
          },
        ],
      },
    });

    $.export("$summary", `Successfully created invoice with number ${this.invoiceNumber}`);
    return response;
  },
};
