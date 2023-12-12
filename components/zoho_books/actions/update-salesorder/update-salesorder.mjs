// legacy_hash_id: a_m8iYLJ
import { axios } from "@pipedream/platform";

export default {
  key: "zoho_books-update-salesorder",
  name: "Update Sales Order",
  description: "Updates an existing sales order.",
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
    salesorder_id: {
      type: "string",
      description: "ID of the sales order to update.",
    },
    customer_id: {
      type: "string",
      description: "ID of the customer to whom the sales order has to be updated.",
    },
    contact_persons: {
      type: "any",
      description: "Array of contact person(s) for whom sales order has to be sent.",
      optional: true,
    },
    date: {
      type: "string",
      description: "The date, the sales order is created.",
      optional: true,
    },
    shipment_date: {
      type: "string",
      description: "Shipping date of sales order.",
      optional: true,
    },
    custom_fields: {
      type: "any",
      description: "Custom fields for a sales order.",
      optional: true,
    },
    place_of_supply: {
      type: "string",
      description: "Place where the goods/services are supplied to. (If not given, `place of contact` given for the contact will be taken)\nSupported codes for UAE emirates are :\nAbu Dhabi - AB`,\nAjman - `AJ`,\nDubai - `DU`,\nFujairah - `FU`,\nRas al-Khaimah - `RA`,\nSharjah - `SH`,\nUmm al-Quwain - `UM`\nSupported codes for the GCC countries are :\nUnited Arab Emirates - `AE`,\nSaudi Arabia - `SA`,\nBahrain - `BH`,\nKuwait - `KW`,\nOman - `OM`,\nQatar - `QA`.",
      optional: true,
    },
    salesperson_id: {
      type: "string",
      description: "ID of the salesperson.",
      optional: true,
    },
    merchant_id: {
      type: "string",
      description: "ID of the merchant.",
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
    is_inclusive_tax: {
      type: "boolean",
      description: "Used to specify whether the line item rates are inclusive or exclusive of tax.",
      optional: true,
    },
    line_items: {
      type: "any",
      description: "Line items of a sales order. To delete a line item just remove it from this line_items list.",
      optional: true,
    },
    notes: {
      type: "string",
      description: "Notes for this Sales Order.",
      optional: true,
    },
    terms: {
      type: "string",
      optional: true,
    },
    billing_address_id: {
      type: "string",
      description: "ID of the Billing Address",
      optional: true,
    },
    shipping_address_id: {
      type: "string",
      description: "ID of the Shipping Address.",
      optional: true,
    },
    crm_owner_id: {
      type: "string",
      optional: true,
    },
    crm_custom_reference_id: {
      type: "string",
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
      options: [
        "vat_registered",
        "vat_not_registered",
        "gcc_vat_not_registered",
        "gcc_vat_registered",
        "non_gcc",
        "dz_vat_registered",
        "dz_vat_not_registered",
      ],
    },
    salesorder_number: {
      type: "string",
      description: "Mandatory if auto number generation is disabled.",
      optional: true,
    },
    reference_number: {
      type: "string",
      description: "**For Customer Only** : If a contact is assigned to any particular user, that user can manage transactions for the contact",
      optional: true,
    },
    is_update_customer: {
      type: "boolean",
      description: "Boolean to update billing address of customer.",
      optional: true,
    },
    discount: {
      type: "string",
      description: "Discount applied to the sales order. It can be either in % or in amount. e.g. 12.5% or 190.",
      optional: true,
    },
    exchange_rate: {
      type: "string",
      description: "Exchange rate of the currency.",
      optional: true,
    },
    salesperson_name: {
      type: "string",
      description: "Name of the sales person.",
      optional: true,
    },
    notes_default: {
      type: "string",
      description: "Default Notes for the Sales Order.",
      optional: true,
    },
    terms_default: {
      type: "string",
      description: "Default Terms of the Sales Order.",
      optional: true,
    },
    tax_id: {
      type: "string",
      description: "Tax ID for the Sales Order.",
      optional: true,
    },
    tax_authority_id: {
      type: "string",
      description: "ID of the tax authority. Tax authority depends on the location of the customer.",
      optional: true,
    },
    tax_exemption_id: {
      type: "string",
      description: "ID of the tax exemption applied.",
      optional: true,
    },
    tax_authority_name: {
      type: "string",
      description: "Tax Authority's name.",
      optional: true,
    },
    tax_exemption_code: {
      type: "string",
      description: "Code of Tax Exemption that is applied.",
      optional: true,
    },
    avatax_exempt_no: {
      type: "string",
      description: "Exemption certificate number of the customer.",
      optional: true,
    },
    avatax_use_code: {
      type: "string",
      description: "Used to group like customers for exemption purposes. It is a custom value that links customers to a tax rule.",
      optional: true,
    },
    shipping_charge: {
      type: "string",
      optional: true,
    },
    adjustment: {
      type: "string",
      optional: true,
    },
    delivery_method: {
      type: "string",
      optional: true,
    },
    is_discount_before_tax: {
      type: "boolean",
      description: "Used to specify how the discount has to applied. Either before or after the calculation of tax.",
      optional: true,
    },
    discount_type: {
      type: "string",
      description: "How the discount is specified. Allowed values are entity_level or item_level.",
      optional: true,
      options: [
        "entity_level",
        "item_level",
      ],
    },
    adjustment_description: {
      type: "string",
      optional: true,
    },
    pricebook_id: {
      type: "string",
      optional: true,
    },
    template_id: {
      type: "string",
      description: "ID of the pdf template.",
      optional: true,
    },
    documents: {
      type: "any",
      optional: true,
    },
    zcrm_potential_id: {
      type: "string",
      optional: true,
    },
    zcrm_potential_name: {
      type: "string",
      optional: true,
    },
    ignore_auto_number_generation: {
      type: "string",
      description: "Ignore auto sales order number generation for this sales order. This mandates the sales order number.",
      optional: true,
    },
    can_send_in_mail: {
      type: "string",
      description: "Can the file be sent in mail.",
      optional: true,
    },
    totalFiles: {
      type: "string",
      description: "Total number of files.",
      optional: true,
    },
    doc: {
      type: "string",
      description: "Document that is to be attached",
      optional: true,
    },
  },
  async run({ $ }) {
  //See the API docs: https://www.zoho.com/books/api/v3/#Sales-Order_Update_a_sales_order

    if (!this.organization_id || !this.salesorder_id) {
      throw new Error("Must provide organization_id, salesorder_id parameters.");
    }

    return await axios($, {
      method: "put",
      url: `https://books.${this.zoho_books.$auth.base_api_uri}/api/v3/salesorders/${this.salesorder_id}?organization_id=${this.organization_id}`,
      headers: {
        Authorization: `Zoho-oauthtoken ${this.zoho_books.$auth.oauth_access_token}`,
      },
      data: {
        customer_id: this.customer_id,
        contact_persons: this.contact_persons,
        date: this.date,
        shipment_date: this.shipment_date,
        custom_fields: this.custom_fields,
        place_of_supply: this.place_of_supply,
        salesperson_id: this.salesperson_id,
        merchant_id: this.merchant_id,
        gst_treatment: this.gst_treatment,
        gst_no: this.gst_no,
        is_inclusive_tax: this.is_inclusive_tax,
        line_items: this.line_items,
        notes: this.notes,
        terms: this.terms,
        billing_address_id: this.billing_address_id,
        shipping_address_id: this.shipping_address_id,
        crm_owner_id: this.crm_owner_id,
        crm_custom_reference_id: this.crm_custom_reference_id,
        vat_treatment: this.vat_treatment,
        tax_treatment: this.tax_treatment,
        salesorder_number: this.salesorder_number,
        reference_number: this.reference_number,
        is_update_customer: this.is_update_customer,
        discount: this.discount,
        exchange_rate: this.exchange_rate,
        salesperson_name: this.salesperson_name,
        notes_default: this.notes_default,
        terms_default: this.terms_default,
        tax_id: this.tax_id,
        tax_authority_id: this.tax_authority_id,
        tax_exemption_id: this.tax_exemption_id,
        tax_authority_name: this.tax_authority_name,
        tax_exemption_code: this.tax_exemption_code,
        avatax_exempt_no: this.avatax_exempt_no,
        avatax_use_code: this.avatax_use_code,
        shipping_charge: this.shipping_charge,
        adjustment: this.adjustment,
        delivery_method: this.delivery_method,
        is_discount_before_tax: this.is_discount_before_tax,
        discount_type: this.discount_type,
        adjustment_description: this.adjustment_description,
        pricebook_id: this.pricebook_id,
        template_id: this.template_id,
        documents: this.documents,
        zcrm_potential_id: this.zcrm_potential_id,
        zcrm_potential_name: this.zcrm_potential_name,
      },
      params: {
        ignore_auto_number_generation: this.ignore_auto_number_generation,
        can_send_in_mail: this.can_send_in_mail,
        totalFiles: this.totalFiles,
        doc: this.doc,
      },
    });
  },
};
