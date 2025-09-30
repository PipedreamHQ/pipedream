import { ConfigurationError } from "@pipedream/platform";
import alegra from "../../alegra.app.mjs";
import {
  INVOICE_STATUS_OPTIONS, PERIODICITY_OPTIONS,
} from "../../common/constants.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "alegra-create-invoice",
  name: "Create Invoice",
  description: "Creates a new invoice in Alegra. [See the documentation](https://developer.alegra.com/reference/post_invoices)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    alegra,
    status: {
      type: "string",
      label: "Status",
      description: "Status of the invoice. If this attribute is not sent and no associated payments are sent, the invoice is created in \"draft\". If payments are sent to the invoice, the invoice is created in \"open\".",
      options: INVOICE_STATUS_OPTIONS,
      optional: true,
    },
    numberTemplateId: {
      type: "string",
      label: "Number Template ID",
      description: "Number template ID for the invoice. You can use this to automatically numbering.",
      optional: true,
    },
    numberTemplatePrefix: {
      type: "string",
      label: "Number Template Prefix",
      description: "Number template prefix for the invoice. Send in case the numbering is manual. (Optional)",
      optional: true,
    },
    numberTemplateNumber: {
      type: "string",
      label: "Number Template Number",
      description: "Number template number for the invoice. Send in case the numbering is manual. (Required)",
      optional: true,
    },
    items: {
      type: "string[]",
      label: "Items",
      description: "Array of item objects (products/services) associated with the invoice. **Example: [{\"id\": \"123\", \"name\": \"Name\", \"price\": \"12.00\", \"quantity\": \"2\"}]**. [See the documentation](https://developer.alegra.com/reference/post_invoices) for further information.",
    },
    payments: {
      type: "string[]",
      label: "Payments",
      description: "Array of objects indicating the payments made to the invoice. **Example: [{\"date\": \"YYYY-MM-DD\", \"account\": \"123123\", \"amount\": \"10,00\"}]**. [See the documentation](https://developer.alegra.com/reference/post_invoices) for further information.",
      optional: true,
    },
    estimate: {
      type: "string",
      label: "Estimate",
      description: "Specifies the identifier of the quote you want to associate with the sales invoice, in this way, the quote is invoiced and the items specified in the items parameter are associated, not those in the quote.",
      optional: true,
    },
    termsConditions: {
      type: "string",
      label: "Terms and Conditions",
      description: "Terms and conditions of the invoice. Maximum allowed length: 500.",
      optional: true,
    },
    annotation: {
      type: "string",
      label: "Annotation",
      description: "Invoice notes, visible in the PDF or printed document. Maximum allowed length: 500.",
      optional: true,
    },
    dueDate: {
      type: "string",
      label: "Due Date",
      description: "Invoice due date. Format yyyy-MM-dd.",
    },
    date: {
      type: "string",
      label: "Date",
      description: "Invoice date. Format yyyy-MM-dd.",
    },
    observations: {
      type: "string",
      label: "Observations",
      description: "Invoice observations (not visible in the PDF or printed document). Maximum allowed length: 500.",
      optional: true,
    },
    client: {
      propDefinition: [
        alegra,
        "client",
      ],
    },
    seller: {
      propDefinition: [
        alegra,
        "seller",
      ],
      description: "Seller associated with the invoice.",
      optional: true,
    },
    pricelist: {
      propDefinition: [
        alegra,
        "priceList",
      ],
      description: "Price list associated with the invoice",
      optional: true,
    },
    currency: {
      type: "object",
      label: "Currency",
      description: "Object that includes the information of the currency and exchange rate associated with the invoice. It should only be included if the company has the multi-currency functionality active and has configured the selected currency. It must include the currency code (three letters according to ISO) and the exchange rate.",
      optional: true,
    },
    retentions: {
      type: "string[]",
      label: "Retentions",
      description: "Array of retention objects indicating the retentions of the sales invoice. **Example: [{\"id\": \"123123\", \"amount\": 10}]**. [See the documentation](https://developer.alegra.com/reference/post_invoices) for further information.",
      optional: true,
    },
    warehouse: {
      propDefinition: [
        alegra,
        "warehouse",
      ],
      optional: true,
    },
    remissions: {
      type: "string[]",
      label: "Remissions",
      description: "Array of identifiers of the remissions to be invoiced, you can associate one or more remissions by simply indicating the id of each one in an array. The client of the remissions and the sales invoice must be the same. Only open remissions can be invoiced. In this way, the items of each remission will be invoiced, and you can also specify other items with the items parameter. **Example: [{\"id\": 123, \"items\": [{\"id\": 123}], }]**.  [See the documentation](https://developer.alegra.com/reference/post_invoices) for further information.",
      optional: true,
    },
    costCenter: {
      propDefinition: [
        alegra,
        "costCenter",
      ],
      optional: true,
    },
    comments: {
      type: "string[]",
      label: "Comments",
      description: "Array of strings with each of the comments to be associated. Comments can be updated even if the sales invoice cannot be edited.",
      optional: true,
    },
    periodicity: {
      type: "string",
      label: "Periodicity",
      description: "Indicates the periodicity of the payments of the invoice installments. If you want to issue the invoice, the payment method is on credit this attribute becomes mandatory.",
      options: PERIODICITY_OPTIONS,
      optional: true,
    },
  },
  async run({ $ }) {
    try {
      const invoice = await this.alegra.generateInvoice({
        $,
        data: {
          status: this.status,
          numberTemplate: {
            id: this.numberTemplateId,
            prefix: this.numberTemplatePrefix,
            number: this.numberTemplateNumber,
          },
          items: parseObject(this.items),
          payments: parseObject(this.payments),
          estimate: this.estimate,
          termsConditions: this.termsConditions,
          annotation: this.annotation,
          dueDate: this.dueDate,
          date: this.date,
          observations: this.observations,
          client: {
            id: this.client,
          },
          seller: this.seller,
          pricelist: this.pricelist,
          currency: parseObject(this.currency),
          retentions: parseObject(this.retentions),
          warehouse: this.warehouse,
          remissions: parseObject(this.remissions),
          costCenter: this.costCenter,
          comments: parseObject(this.comments),
          periodicity: this.periodicity,
        },
      });
      $.export("$summary", `Created invoice with ID ${invoice.id}`);
      return invoice;
    } catch (e) {
      throw new ConfigurationError(e.response.data.message);
    }
  },
};
