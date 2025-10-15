// legacy_hash_id: a_m8iYLJ
import { ConfigurationError } from "@pipedream/platform";
import {
  clearObj, parseObject,
} from "../../common/utils.mjs";
import zohoBooks from "../../zoho_books.app.mjs";

export default {
  key: "zoho_books-update-salesorder",
  name: "Update Sales Order",
  description: "Updates an existing sales order. [See the documentation](https://www.zoho.com/books/api/v3/sales-order/#update-a-sales-order)",
  version: "0.3.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    zohoBooks,
    salesorderId: {
      propDefinition: [
        zohoBooks,
        "salesorderId",
      ],
    },
    customerId: {
      propDefinition: [
        zohoBooks,
        "customerId",
      ],
      description: "ID of the customer to whom the sales order has to be created.",
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
      description: "A list of contact person(s) for whom sales order has to be sent.",
      optional: true,
    },
    date: {
      propDefinition: [
        zohoBooks,
        "date",
      ],
      optional: true,
    },
    shipmentDate: {
      propDefinition: [
        zohoBooks,
        "shipmentDate",
      ],
      optional: true,
    },
    customFields: {
      propDefinition: [
        zohoBooks,
        "customFields",
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
    salespersonId: {
      propDefinition: [
        zohoBooks,
        "salespersonId",
      ],
      optional: true,
    },
    merchantId: {
      propDefinition: [
        zohoBooks,
        "merchantId",
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
    isInclusiveTax: {
      propDefinition: [
        zohoBooks,
        "isInclusiveTax",
      ],
      optional: true,
    },
    lineItems: {
      propDefinition: [
        zohoBooks,
        "lineItems",
      ],
      optional: true,
    },
    notes: {
      propDefinition: [
        zohoBooks,
        "notes",
      ],
      optional: true,
    },
    terms: {
      propDefinition: [
        zohoBooks,
        "terms",
      ],
      optional: true,
    },
    billingAddressId: {
      propDefinition: [
        zohoBooks,
        "billingAddressId",
      ],
      optional: true,
    },
    shippingAddressId: {
      propDefinition: [
        zohoBooks,
        "shippingAddressId",
      ],
      optional: true,
    },
    crmOwnerId: {
      propDefinition: [
        zohoBooks,
        "crmOwnerId",
      ],
      optional: true,
    },
    crmCustomReferenceId: {
      propDefinition: [
        zohoBooks,
        "crmCustomReferenceId",
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
      optional: true,
    },
    salesorderNumber: {
      propDefinition: [
        zohoBooks,
        "salesorderNumber",
      ],
      optional: true,
    },
    referenceNumber: {
      propDefinition: [
        zohoBooks,
        "referenceNumber",
      ],
      optional: true,
    },
    isUpdateCustomer: {
      propDefinition: [
        zohoBooks,
        "isUpdateCustomer",
      ],
      optional: true,
    },
    discount: {
      propDefinition: [
        zohoBooks,
        "discount",
      ],
      optional: true,
    },
    exchangeRate: {
      propDefinition: [
        zohoBooks,
        "exchangeRate",
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
    notesDefault: {
      propDefinition: [
        zohoBooks,
        "notesDefault",
      ],
      optional: true,
    },
    termsDefault: {
      propDefinition: [
        zohoBooks,
        "termsDefault",
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
    taxAuthorityName: {
      propDefinition: [
        zohoBooks,
        "taxAuthorityName",
      ],
      optional: true,
    },
    taxExemptionCode: {
      propDefinition: [
        zohoBooks,
        "taxExemptionCode",
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
    avataxUseCode: {
      propDefinition: [
        zohoBooks,
        "avataxUseCode",
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
    deliveryMethod: {
      propDefinition: [
        zohoBooks,
        "deliveryMethod",
      ],
      optional: true,
    },
    estimateId: {
      type: "string",
      label: "Estimate Id",
      description: "ID of the estimate associated with the Sales Order.",
      optional: true,
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
    adjustmentDescription: {
      propDefinition: [
        zohoBooks,
        "adjustmentDescription",
      ],
      optional: true,
    },
    pricebookId: {
      propDefinition: [
        zohoBooks,
        "pricebookId",
      ],
      optional: true,
    },
    templateId: {
      propDefinition: [
        zohoBooks,
        "pdfTemplateId",
      ],
      optional: true,
    },
    documents: {
      propDefinition: [
        zohoBooks,
        "documents",
      ],
      optional: true,
    },
    zcrmPotentialId: {
      propDefinition: [
        zohoBooks,
        "zcrmPotentialId",
      ],
      optional: true,
    },
    zcrmPotentialName: {
      propDefinition: [
        zohoBooks,
        "zcrmPotentialName",
      ],
      optional: true,
    },
    ignoreAutoNumberGeneration: {
      propDefinition: [
        zohoBooks,
        "ignoreAutoNumberGeneration",
      ],
      optional: true,
    },
    canSendInMail: {
      propDefinition: [
        zohoBooks,
        "canSendInMail",
      ],
      optional: true,
    },
    totalFiles: {
      propDefinition: [
        zohoBooks,
        "totalFiles",
      ],
      optional: true,
    },
    doc: {
      propDefinition: [
        zohoBooks,
        "doc",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const data = clearObj({
      customer_id: this.customerId,
      contact_persons: this.contactPersons,
      date: this.date,
      shipment_date: this.shipmentDate,
      custom_fields: parseObject(this.customFields),
      place_of_supply: this.placeOfSupply,
      salesperson_id: this.salespersonId,
      merchant_id: this.merchantId,
      gst_treatment: this.gstTreatment,
      gst_no: this.gstNo,
      is_inclusive_tax: this.isInclusiveTax,
      line_items: parseObject(this.lineItems),
      notes: this.notes,
      terms: this.terms,
      billing_address_id: this.billingAddressId,
      shipping_address_id: this.shippingAddressId,
      crm_owner_id: this.crmOwnerId,
      crm_custom_reference_id: this.crmCustomReferenceId,
      vat_treatment: this.vatTreatment,
      tax_treatment: this.taxTreatment,
      salesorder_number: this.salesorderNumber,
      reference_number: this.referenceNumber,
      is_update_customer: this.isUpdateCustomer,
      discount: this.discount,
      exchange_rate: this.exchangeRate && parseFloat(this.exchangeRate),
      salesperson_name: this.salespersonName,
      notes_default: this.notesDefault,
      terms_default: this.termsDefault,
      tax_id: this.taxId,
      tax_authority_id: this.taxAuthorityId,
      tax_exemption_id: this.taxExemptionId,
      tax_authority_name: this.taxAuthorityName,
      tax_exemption_code: this.taxExemptionCode,
      avatax_exempt_no: this.avataxExemptNo,
      avatax_use_code: this.avataxUseCode,
      shipping_charge: this.shippingCharge && parseFloat(this.shippingCharge),
      adjustment: this.adjustment && parseFloat(this.adjustment),
      delivery_method: this.deliveryMethod,
      estimate_id: this.estimateId,
      is_discount_before_tax: this.isDiscountBeforeTax,
      discount_type: this.discountType,
      adjustment_description: this.adjustmentDescription,
      pricebook_id: this.pricebookId,
      template_id: this.templateId,
      documents: parseObject(this.documents),
      zcrm_potential_id: this.zcrmPotentialId,
      zcrm_potential_name: this.zcrmPotentialName,
    });

    if (!Object.keys(data).length) {
      throw new ConfigurationError("You must provide at least one field.");
    }
    const response = await this.zohoBooks.updateSalesorder({
      $,
      salesorderId: this.salesorderId,
      params: clearObj({
        ignore_auto_number_generation: this.ignoreAutoNumberGeneration,
        can_send_in_mail: this.canSendInMail,
        totalFiles: this.totalFiles,
        doc: this.doc,
      }),
      data,
    });

    $.export("$summary", `Salesorder successfully updated with Id: ${this.salesorderId}`);
    return response;
  },
};
