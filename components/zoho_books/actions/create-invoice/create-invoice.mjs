// legacy_hash_id: a_EVix1V
import { parseObject } from "../../common/utils.mjs";
import zohoBooks from "../../zoho_books.app.mjs";

export default {
  key: "zoho_books-create-invoice",
  name: "Create Invoice",
  description: "Creates an invoice for your customer. [See the documentation](https://www.zoho.com/books/api/v3/invoices/#create-an-invoice)",
  version: "0.3.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    zohoBooks,
    customerId: {
      propDefinition: [
        zohoBooks,
        "customerId",
      ],
      description: "ID of the customer the invoice has to be created.",
    },
    invoiceNumber: {
      type: "string",
      label: "Invoice Number",
      description: "Search invoices by invoice number. Max-length [100]",
      optional: true,
    },
    placeOfSupply: {
      propDefinition: [
        zohoBooks,
        "placeOfSupply",
      ],
      optional: true,
    },
    vatTreatment: {
      propDefinition: [
        zohoBooks,
        "vatTreatment",
      ],
      optional: true,
    },
    referenceNumber: {
      type: "string",
      label: "Reference Number",
      description: "The reference number of the invoice.",
      optional: true,
    },
    templateId: {
      propDefinition: [
        zohoBooks,
        "templateId",
      ],
      optional: true,
    },
    date: {
      type: "string",
      label: "Date",
      description: "Search invoices by invoice date. Default date format is yyyy-mm-dd.",
      optional: true,
    },
    paymentTerms: {
      propDefinition: [
        zohoBooks,
        "paymentTerms",
      ],
      optional: true,
    },
    paymentTermsLabel: {
      propDefinition: [
        zohoBooks,
        "paymentTermsLabel",
      ],
      optional: true,
    },
    dueDate: {
      type: "string",
      label: "Due Date",
      description: "Search invoices by due date. Default date format is yyyy-mm-dd. `Variants: due_date_start, due_date_end, due_date_before and due_date_after`",
      optional: true,
    },
    discount: {
      propDefinition: [
        zohoBooks,
        "discount",
      ],
      optional: true,
      description: "Discount applied to the invoice. It can be either in % or in amount. e.g. 12.5% or 190. Max-length [100]",
    },
    isDiscountBeforeTax: {
      propDefinition: [
        zohoBooks,
        "isDiscountBeforeTax",
      ],
      optional: true,
    },
    discountType: {
      propDefinition: [
        zohoBooks,
        "discountType",
      ],
      optional: true,
    },
    isInclusiveTax: {
      propDefinition: [
        zohoBooks,
        "isInclusiveTax",
      ],
      optional: true,
    },
    exchangeRate: {
      type: "string",
      label: "Exchange Rate",
      description: "Exchange rate of the currency.",
      optional: true,
    },
    recurringInvoiceId: {
      propDefinition: [
        zohoBooks,
        "recurringInvoiceId",
        ({ customerId }) => ({
          customerId,
        }),
      ],
      optional: true,
    },
    invoicedEstimateId: {
      type: "string",
      label: "Invoiced Estimate Id",
      description: "ID of the invoice from which the invoice is created.",
      optional: true,
    },
    salespersonName: {
      propDefinition: [
        zohoBooks,
        "salespersonName",
      ],
      optional: true,
    },
    customFields: {
      propDefinition: [
        zohoBooks,
        "customFields",
      ],
      description: "A list of custom fields objects for an invoice. **Example: {\"customfield_id\": 123123, \"value\": \"value\"}**",
      optional: true,
    },
    lineItems: {
      propDefinition: [
        zohoBooks,
        "lineItems",
      ],
      optional: true,
      description: "A list of line items objects of an estimate. **Example: {\"item_id\": \"1352827000000156060\", \"notes\": \"note\", \"name\": \"Item name\", \"quantity\": \"1\" }** [See the documentation](https://www.zoho.com/books/api/v3/invoices/#create-an-invoice) for further details.",
    },
    paymentOptions: {
      type: "object",
      label: "Payment Options",
      description: "Payment options for the invoice, online payment gateways and bank accounts. Will be displayed in the pdf. **Example: {\"payment_gateways\": [\"configured\": true, \"additional_field1\": \"standard\", \"gateway_name\": \"paypal\"]}** [See the documentation](https://www.zoho.com/books/api/v3/invoices/#create-an-invoice) for further details.",
      optional: true,
    },
    allowPartialPayments: {
      type: "boolean",
      label: "Allow Partial Payments",
      description: "Boolean to check if partial payments are allowed for the contact",
      optional: true,
    },
    customBody: {
      propDefinition: [
        zohoBooks,
        "customBody",
      ],
      optional: true,
    },
    customSubject: {
      propDefinition: [
        zohoBooks,
        "customSubject",
      ],
      optional: true,
    },
    notes: {
      propDefinition: [
        zohoBooks,
        "notes",
      ],
      description: "The notes added below expressing gratitude or for conveying some information.",
      optional: true,
    },
    terms: {
      propDefinition: [
        zohoBooks,
        "terms",
      ],
      optional: true,
    },
    shippingCharge: {
      propDefinition: [
        zohoBooks,
        "shippingCharge",
      ],
      optional: true,
    },
    adjustment: {
      propDefinition: [
        zohoBooks,
        "adjustment",
      ],
      optional: true,
    },
    adjustmentDescription: {
      propDefinition: [
        zohoBooks,
        "adjustmentDescription",
      ],
      optional: true,
    },
    reason: {
      type: "string",
      label: "Reason",
      optional: true,
    },
    taxAuthorityId: {
      propDefinition: [
        zohoBooks,
        "taxAuthorityId",
      ],
      optional: true,
    },
    taxExemptionId: {
      propDefinition: [
        zohoBooks,
        "taxExemptionId",
      ],
      optional: true,
    },
    taxId: {
      propDefinition: [
        zohoBooks,
        "taxId",
      ],
      optional: true,
    },
    expenseId: {
      propDefinition: [
        zohoBooks,
        "expenseId",
      ],
      optional: true,
    },
    salesorderItemId: {
      type: "string",
      label: "Salesorder Item Id",
      description: "ID of the sales order line item which is invoices.",
      optional: true,
    },
    avataxTaxCode: {
      type: "string",
      label: "Avatax Tax Code",
      description: "A tax code is a unique label used to group Items (products, services, or charges) together. Refer the [link][2] for more deails. Max-length [25]",
      optional: true,
    },
    timeEntryIds: {
      propDefinition: [
        zohoBooks,
        "timeEntryIds",
      ],
      optional: true,
    },
    send: {
      propDefinition: [
        zohoBooks,
        "send",
      ],
      optional: true,
    },
    ignoreAutoNumberGeneration: {
      propDefinition: [
        zohoBooks,
        "ignoreAutoNumberGeneration",
      ],
      optional: true,
      description: "Ignore auto estimate number generation for this estimate. This mandates the estimate number.",
    },
  },
  async run({ $ }) {
    const response = await this.zohoBooks.createInvoice({
      $,
      params: {
        send: this.send,
        ignore_auto_number_generation: this.ignoreAutoNumberGeneration,
      },
      data: {
        customer_id: this.customerId,
        invoice_number: this.invoiceNumber,
        place_of_supply: this.placeOfSupply,
        vat_treatment: this.vatTreatment,
        reference_number: this.referenceNumber,
        template_id: this.templateId,
        date: this.date,
        payment_terms: this.paymentTerms,
        payment_terms_label: this.paymentTermsLabel,
        due_date: this.dueDate,
        discount: this.discount && parseFloat(this.discount),
        is_discount_before_tax: this.isDiscountBeforeTax,
        discount_type: this.discountType,
        is_inclusive_tax: this.isInclusiveTax,
        exchange_rate: this.exchangeRate && parseFloat(this.exchangeRate),
        recurring_invoice_id: this.recurringInvoiceId,
        invoiced_estimate_id: this.invoicedEstimateId,
        salesperson_name: this.salespersonName,
        custom_fields: parseObject(this.customFields),
        line_items: parseObject(this.lineItems),
        payment_options: parseObject(this.paymentOptions),
        allow_partial_payments: this.allowPartialPayments,
        custom_body: this.customBody,
        custom_subject: this.customSubject,
        notes: this.notes,
        terms: this.terms,
        shipping_charge: this.shippingCharge && parseFloat(this.shippingCharge),
        adjustment: this.adjustment && parseFloat(this.adjustment),
        adjustment_description: this.adjustmentDescription,
        reason: this.reason,
        tax_authority_id: this.taxAuthorityId,
        tax_exemption_id: this.taxExemptionId,
        tax_id: this.taxId,
        expense_id: this.expenseId,
        salesorder_item_id: this.salesorderItemId,
        avatax_tax_code: this.avataxTaxCode,
        time_entry_ids: parseObject(this.timeEntryIds),
      },
    });

    $.export("$summary", `Invoice successfully created with Id: ${response.invoice.invoice_id}`);
    return response;
  },
};
