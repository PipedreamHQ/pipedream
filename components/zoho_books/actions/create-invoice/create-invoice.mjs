// legacy_hash_id: a_EVix1V
import { axios } from "@pipedream/platform";

export default {
  key: "zoho_books-create-invoice",
  name: "Create Invoice",
  description: "Creates an invoice for your customer.",
  version: "0.2.1",
  type: "action",
  props: {
    zoho_books: {
      type: "app",
      app: "zoho_books",
    },
    organization_id: {
      type: "string",
      description: "In Zoho Books, your business is termed as an organization. If you have multiple businesses, you simply set each of those up as an individual organization. Each organization is an independent Zoho Books Organization with it's own organization ID, base currency, time zone, language, contacts, reports, etc.\n\nThe parameter `organization_id` should be sent in with every API request to identify the organization.\n\nThe `organization_id` can be obtained from the GET `/organizations` API's JSON response. Alternatively, it can be obtained from the **Manage Organizations** page in the admin console.",
    },
    customer_id: {
      type: "string",
      description: "ID of the customer the invoice has to be created.",
    },
    line_items: {
      type: "any",
      description: "Line items of an estimate.",
      optional: true,
    },
    contact_persons: {
      type: "any",
      description: "Array of contact person(s) for whom invoice has to be sent.",
      optional: true,
    },
    invoice_number: {
      type: "string",
      description: "Search invoices by invoice number.Variants: `invoice_number_startswith` and `invoice_number_contains`. Max-length [100]",
      optional: true,
    },
    place_of_supply: {
      type: "string",
      description: "Place where the goods/services are supplied to. (If not given, `place of contact` given for the contact will be taken)\nSupported codes for UAE emirates are :\nAbu Dhabi - AB`,\nAjman - `AJ`,\nDubai - `DU`,\nFujairah - `FU`,\nRas al-Khaimah - `RA`,\nSharjah - `SH`,\nUmm al-Quwain - `UM`\nSupported codes for the GCC countries are :\nUnited Arab Emirates - `AE`,\nSaudi Arabia - `SA`,\nBahrain - `BH`,\nKuwait - `KW`,\nOman - `OM`,\nQatar - `QA`.",
      optional: true,
    },
    vat_treatment: {
      type: "string",
      description: "Enter vat treatment.",
      optional: true,
    },
    tax_treatment: {
      type: "string",
      description: "VAT treatment for the invoice .Choose whether the contact falls under: `vat_registered`, `vat_not_registered`, `gcc_vat_not_registered`, `gcc_vat_registered`, `non_gcc` , `dz_vat_registered` and `dz_vat_not_registered` supported only for UAE.",
      optional: true,
    },
    gst_treatment: {
      type: "string",
      description: "Choose whether the contact is GST registered/unregistered/consumer/overseas. Allowed values are `business_gst`, `business_none`, `overseas`, `consumer`.",
      optional: true,
      options: [
        "business_gst",
        "business_none",
        "overseas",
        "consumer",
      ],
    },
    gst_no: {
      type: "string",
      description: "15 digit GST identification number of the customer.",
      optional: true,
    },
    reference_number: {
      type: "string",
      description: "The reference number of the invoice.",
      optional: true,
    },
    template_id: {
      type: "string",
      description: "ID of the pdf template associated with the invoice.",
      optional: true,
    },
    date: {
      type: "string",
      description: "Search invoices by invoice date. Default date format is yyyy-mm-dd. `Variants: due_date_start, due_date_end, due_date_before and due_date_after.`",
      optional: true,
    },
    payment_terms: {
      type: "string",
      description: "Payment terms in days e.g. 15, 30, 60. Invoice due date will be calculated based on this. Max-length [100]",
      optional: true,
    },
    payment_terms_label: {
      type: "boolean",
      description: "Used to override the default payment terms label. Default value for 15 days is \"Net 15 Days\". Max-length [100]",
      optional: true,
    },
    due_date: {
      type: "string",
      description: "Search invoices by due date. Default date format is yyyy-mm-dd. `Variants: due_date_start, due_date_end, due_date_before and due_date_after`",
      optional: true,
      options: [
        "entity_level",
        "item_level",
      ],
    },
    discount: {
      type: "boolean",
      description: "Discount applied to the invoice. It can be either in % or in amount. e.g. 12.5% or 190. Max-length [100]",
      optional: true,
    },
    is_discount_before_tax: {
      type: "boolean",
      description: "Used to specify how the discount has to applied. Either before or after the calculation of tax.",
      optional: true,
    },
    discount_type: {
      type: "string",
      description: "How the discount is specified. Allowed values: `entity_level` and `item_level`.",
      optional: true,
      options: [
        "entity_level",
        "item_level",
      ],
    },
    is_inclusive_tax: {
      type: "string",
      description: "Used to specify whether the line item rates are inclusive or exclusivr of tax.",
      optional: true,
    },
    exchange_rate: {
      type: "any",
      description: "Exchange rate of the currency.",
      optional: true,
    },
    recurring_invoice_id: {
      type: "string",
      description: "ID of the recurring invoice from which the invoice is created.",
      optional: true,
    },
    invoiced_estimate_id: {
      type: "string",
      description: "The notes added below expressing gratitude or for conveying some information.",
      optional: true,
    },
    salesperson_name: {
      type: "string",
      description: "ID of the invoice from which the invoice is created.",
      optional: true,
    },
    custom_fields: {
      type: "any",
      description: "Custom fields for an invoice.",
      optional: true,
    },
    payment_options: {
      type: "object",
      description: "Payment options for the invoice, online payment gateways and bank accounts. Will be displayed in the pdf.",
      optional: true,
    },
    allow_partial_payments: {
      type: "boolean",
      description: "Boolean to check if partial payments are allowed for the contact",
      optional: true,
    },
    custom_body: {
      type: "string",
      optional: true,
    },
    custom_subject: {
      type: "string",
      optional: true,
    },
    notes: {
      type: "string",
      description: "The notes added below expressing gratitude or for conveying some information.",
      optional: true,
    },
    terms: {
      type: "string",
      description: "The terms added below expressing gratitude or for conveying some information.",
      optional: true,
    },
    shipping_charge: {
      type: "string",
      description: "Shipping charges applied to the invoice. Max-length [100]",
      optional: true,
    },
    adjustment: {
      type: "string",
      optional: true,
    },
    adjustment_description: {
      type: "string",
      description: "Adjustments made to the invoice.",
      optional: true,
    },
    reason: {
      type: "string",
      optional: true,
    },
    tax_authority_id: {
      type: "string",
      description: "ID of the tax authority. Tax authority depends on the location of the customer. For example, if the customer is located in NY, then the tax authority is NY tax authority.",
      optional: true,
    },
    tax_exemption_id: {
      type: "string",
      description: "ID of the tax exemption.",
      optional: true,
    },
    avatax_use_code: {
      type: "string",
      description: "Used to group like customers for exemption purposes. It is a custom value that links customers to a tax rule. Select from Avalara [standard codes][1] or enter a custom code. Max-length [25]",
      optional: true,
    },
    avatax_exempt_no: {
      type: "string",
      description: "Exemption certificate number of the customer. Max-length [25]",
      optional: true,
    },
    tax_id: {
      type: "string",
      description: "ID of the tax.",
      optional: true,
    },
    expense_id: {
      type: "string",
      optional: true,
    },
    salesorder_item_id: {
      type: "string",
      description: "ID of the sales order line item which is invoices.",
      optional: true,
    },
    avatax_tax_code: {
      type: "string",
      description: "A tax code is a unique label used to group Items (products, services, or charges) together. Refer the [link][2] for more deails. Max-length [25]",
      optional: true,
    },
    time_entry_ids: {
      type: "any",
      description: "IDs of the time entries associated with the project.",
      optional: true,
    },
    send: {
      type: "boolean",
      description: "Send the estimate to the contact person(s) associated with the estimate.Allowed Values: `true` and `false`",
      optional: true,
    },
    ignore_auto_number_generation: {
      type: "boolean",
      description: "Ignore auto estimate number generation for this estimate. This mandates the estimate number.",
      optional: true,
    },
  },
  async run({ $ }) {
  //See the API docs: https://www.zoho.com/books/api/v3/#Invoices_Create_an_invoice

    if (!this.organization_id || !this.customer_id || !this.line_items) {
      throw new Error("Must provide organization_id, customer_id, and line_items parameters.");
    }

    return await axios($, {
      method: "post",
      url: `https://books.${this.zoho_books.$auth.base_api_uri}/api/v3/invoices?organization_id=${this.organization_id}`,
      headers: {
        Authorization: `Zoho-oauthtoken ${this.zoho_books.$auth.oauth_access_token}`,
      },
      data: {
        customer_id: this.customer_id,
        contact_persons: this.contact_persons,
        invoice_number: this.invoice_number,
        place_of_supply: this.place_of_supply,
        vat_treatment: this.vat_treatment,
        tax_treatment: this.tax_treatment,
        gst_treatment: this.gst_treatment,
        gst_no: this.gst_no,
        reference_number: this.reference_number,
        template_id: this.template_id,
        date: this.date,
        payment_terms: this.payment_terms,
        payment_terms_label: this.payment_terms_label,
        due_date: this.due_date,
        discount: this.discount,
        is_discount_before_tax: this.is_discount_before_tax,
        discount_type: this.discount_type,
        is_inclusive_tax: this.is_inclusive_tax,
        exchange_rate: this.exchange_rate,
        recurring_invoice_id: this.recurring_invoice_id,
        invoiced_estimate_id: this.invoiced_estimate_id,
        salesperson_name: this.salesperson_name,
        custom_fields: this.custom_fields,
        line_items: this.line_items,
        payment_options: this.payment_options,
        allow_partial_payments: this.allow_partial_payments,
        custom_body: this.custom_body,
        custom_subject: this.custom_subject,
        notes: this.notes,
        terms: this.terms,
        shipping_charge: this.shipping_charge,
        adjustment: this.adjustment,
        adjustment_description: this.adjustment_description,
        reason: this.reason,
        tax_authority_id: this.tax_authority_id,
        tax_exemption_id: this.tax_exemption_id,
        avatax_use_code: this.avatax_use_code,
        avatax_exempt_no: this.avatax_exempt_no,
        tax_id: this.tax_id,
        expense_id: this.expense_id,
        salesorder_item_id: this.salesorder_item_id,
        avatax_tax_code: this.avatax_tax_code,
        time_entry_ids: this.time_entry_ids,
      },
      params: {
        send: this.send,
        ignore_auto_number_generation: this.ignore_auto_number_generation,
      },
    });
  },
};
