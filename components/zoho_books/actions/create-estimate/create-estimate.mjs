// legacy_hash_id: a_Xzi1qo
import { parseObject } from "../../common/utils.mjs";
import zohoBooks from "../../zoho_books.app.mjs";

export default {
  key: "zoho_books-create-estimate",
  name: "Create Estimate",
  description: "Creates a new estimate. [See the documentation](https://www.zoho.com/books/api/v3/estimates/#create-an-estimate)",
  version: "0.0.2",
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
    },
    currencyId: {
      propDefinition: [
        zohoBooks,
        "currencyId",
      ],
      optional: true,
    },
    contactPersons: {
      propDefinition: [
        zohoBooks,
        "contactPersons",
        ({ customerId }) => ({
          customerId,
        }),
      ],
      description: "Array if contact person(S) for whom estimate has to be sent.",
      optional: true,
    },
    templateId: {
      propDefinition: [
        zohoBooks,
        "pdfTemplateId",
      ],
      optional: true,
    },
    placeOfSupply: {
      propDefinition: [
        zohoBooks,
        "placeOfSupply",
      ],
      optional: true,
    },
    gstTreatment: {
      propDefinition: [
        zohoBooks,
        "gstTreatment",
      ],
      optional: true,
    },
    gstNo: {
      propDefinition: [
        zohoBooks,
        "gstNo",
      ],
      optional: true,
    },
    estimateNumber: {
      type: "string",
      label: "Estimate Number",
      description: "Search estimates by estimate number.",
      optional: true,
    },
    referenceNumber: {
      type: "string",
      label: "Reference Number",
      description: "Search estimates by reference number.",
      optional: true,
    },
    date: {
      type: "string",
      label: "Date",
      description: "Search estimates by estimate date.",
      optional: true,
    },
    expiryDate: {
      type: "string",
      label: "Expiry Date",
      description: "The date of expiration of the estimates.",
      optional: true,
    },
    exchangeRate: {
      propDefinition: [
        zohoBooks,
        "exchangeRate",
      ],
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
      description: "A list of Additional field objects for the payments. **Example: {\"index\": 1, \"value\": \"value\"}**",
      optional: true,
    },
    lineItems: {
      propDefinition: [
        zohoBooks,
        "lineItems",
      ],
      description: "A list of line items objects of an estimate. **Example: {\"item_id\": \"1352827000000156060\", \"name\": \"name\", \"description\": \"description\", \"quantity\": \"1\" }** [See the documentation](https://www.zoho.com/books/api/v3/sales-order/#create-a-sales-order) for further details.",
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
    taxId: {
      propDefinition: [
        zohoBooks,
        "taxId",
      ],
      description: "ID of the tax to be associated to the estimate.",
      optional: true,
    },
    taxExemptionId: {
      propDefinition: [
        zohoBooks,
        "taxExemptionId",
      ],
      optional: true,
    },
    taxAuthorityId: {
      propDefinition: [
        zohoBooks,
        "taxAuthorityId",
      ],
      optional: true,
    },
    avataxUseCode: {
      propDefinition: [
        zohoBooks,
        "avataxUseCode",
      ],
      optional: true,
    },
    avataxExemptNo: {
      propDefinition: [
        zohoBooks,
        "taxExemptionId",
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
    taxTreatment: {
      propDefinition: [
        zohoBooks,
        "taxTreatment",
      ],
      description: "VAT treatment for the estimate.",
      optional: true,
    },
    isReverseChargeApplied: {
      type: "boolean",
      label: "Is Reverse Charge Applied.",
      description: "Used to specify whether the transaction is applicable for Domestic Reverse Charge (DRC) or not.",
      optional: true,
    },
    itemId: {
      propDefinition: [
        zohoBooks,
        "itemId",
      ],
      optional: true,
    },
    lineItemId: {
      type: "string",
      label: "Line Item Id",
      description: "ID of the line item. Mandatory, if the existing line item has to be updated. If empty, a new line item will be created.",
      optional: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name of the line item.",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of the line item.",
      optional: true,
    },
    rate: {
      type: "string",
      label: "Rate",
      description: "Rate of the line item.",
      optional: true,
    },
    unit: {
      type: "string",
      label: "Unit",
      description: "Unit of the line item. E.g. kgs, Nos",
      optional: true,
    },
    quantity: {
      type: "integer",
      label: "Quantity",
      description: "The quantity of line item.",
      optional: true,
    },
    projectId: {
      type: "string",
      label: "Project Id",
      description: "Id of the project",
      optional: true,
    },
    acceptRetainer: {
      type: "boolean",
      label: "Accept Retainer",
      description: "The \"Accept Retainer\" node should be passed for the retainer invoice to be created automatically, provided that the customer has accepted the quote.",
      optional: true,
    },
    retainerPercentage: {
      type: "integer",
      label: "Retainer Percentage",
      description: "Pass the \"Retainer Percentage\" node to create the retainer invoice automatically.",
      min: 1,
      max: 100,
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
    const response = await this.zohoBooks.createEstimate({
      $,
      params: {
        send: this.send,
        ignore_auto_number_generation: this.ignoreAutoNumberGeneration,
      },
      data: {
        customer_id: this.customerId,
        currency_id: this.currencyId,
        contact_persons: parseObject(this.contactPersons),
        template_id: this.templateId,
        place_of_supply: this.placeOfSupply,
        gst_treatment: this.gstTreatment,
        gst_no: this.gstNo,
        estimate_number: this.estimateNumber,
        reference_number: this.referenceNumber,
        date: this.date,
        expiry_date: this.expiryDate,
        exchange_rate: this.exchangeRate && parseFloat(this.exchangeRate),
        discount: this.discount && parseFloat(this.discount),
        is_discount_before_tax: this.isDiscountBeforeTax,
        discount_type: this.discountType,
        is_inclusive_tax: this.isInclusiveTax,
        custom_body: this.customBody,
        custom_subject: this.customSubject,
        salesperson_name: this.salespersonName,
        custom_fields: parseObject(this.customFields),
        line_items: parseObject(this.lineItems),
        notes: this.notes,
        terms: this.terms,
        shipping_charge: this.shippingCharge,
        adjustment: this.adjustment && parseFloat(this.adjustment),
        adjustment_description: this.adjustmentDescription,
        tax_id: this.taxId,
        tax_exemption_id: this.taxExemptionId,
        tax_authority_id: this.taxAuthorityId,
        avatax_use_code: this.avataxUseCode,
        avatax_exempt_no: this.avataxExemptNo,
        vat_treatment: this.vatTreatment,
        tax_treatment: this.taxTreatment,
        is_reverse_charge_applied: this.isReverseChargeApplied,
        item_id: this.itemId,
        line_item_id: this.lineItemId,
        name: this.name,
        description: this.description,
        rate: this.rate && parseFloat(this.rate),
        unit: this.unit,
        quantity: this.quantity,
        project_id: this.projectId,
        accept_retainer: this.acceptRetainer,
        retainer_percentage: this.retainerPercentage,
      },
    });

    $.export("$summary", `Item successfully created with Id: ${response.estimate.estimate_id}`);
    return response;
  },
};
