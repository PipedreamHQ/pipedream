// legacy_hash_id: a_Xzi1qo
import {
  CUSTOMER_SUB_TYPE_OPTIONS,
  LANGUAGE_CODE_OPTIONS,
} from "../../common/constants.mjs";
import {
  clearObj,
  parseObject,
} from "../../common/utils.mjs";
import zohoBooks from "../../zoho_books.app.mjs";

export default {
  key: "zoho_books-create-customer",
  name: "Create Customer",
  description: "Creates a new customer. [See the documentation](https://www.zoho.com/books/api/v3/items/#create-an-item)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    zohoBooks,
    contactName: {
      type: "string",
      label: "Contact Name",
      description: "Display Name of the contact. Max-length [200].",
    },
    companyName: {
      type: "string",
      label: "Company Name",
      description: "Company Name of the contact. Max-length [200].",
      optional: true,
    },
    website: {
      type: "string",
      label: "Website",
      description: "Website of the contact.",
      optional: true,
    },
    languageCode: {
      type: "string",
      label: "Language Code",
      description: "The language of a contact.",
      options: LANGUAGE_CODE_OPTIONS,
      optional: true,
    },
    customerSubType: {
      type: "string",
      label: "Customer Sub Type",
      description: "Type of the customer.",
      options: CUSTOMER_SUB_TYPE_OPTIONS,
      optional: true,
    },
    creditLimit: {
      type: "string",
      label: "Credit Limit",
      description: "Credit limit for a customer.",
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "An array of tag objects. **Example: {\"tag_id\":\"124567890\",\"tag_option_id\":\"1234567890\"}**",
      optional: true,
    },
    isPortalEnabled: {
      type: "boolean",
      label: "Is Portal Enabled",
      description: "To enable client portal for the contact.",
      optional: true,
    },
    currencyId: {
      propDefinition: [
        zohoBooks,
        "currencyId",
      ],
      optional: true,
    },
    paymentTerms: {
      propDefinition: [
        zohoBooks,
        "paymentTerms",
      ],
      description: "Net payment term for the customer.",
      optional: true,
    },
    paymentTermsLabel: {
      propDefinition: [
        zohoBooks,
        "paymentTermsLabel",
      ],
      description: "Label for the paymet due details.",
      optional: true,
    },
    notes: {
      propDefinition: [
        zohoBooks,
        "notes",
      ],
      description: "Commennts about the payment made by the contact.",
      optional: true,
    },
    exchangeRate: {
      propDefinition: [
        zohoBooks,
        "exchangeRate",
      ],
      description: "Exchange rate for the opening balance.",
      optional: true,
    },
    vatTreatment: {
      propDefinition: [
        zohoBooks,
        "vatTreatment",
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
    avataxUseCode: {
      propDefinition: [
        zohoBooks,
        "avataxUseCode",
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
  },
  async run({ $ }) {
    const response = await this.zohoBooks.createContact({
      $,
      data: clearObj({
        contact_name: this.contactName,
        company_name: this.companyName,
        website: this.website,
        language_code: this.languageCode,
        contact_type: "customer",
        customer_sub_type: this.customerSubType,
        credit_limit: this.creditLimit,
        tags: parseObject(this.tags),
        is_portal_enabled: this.isPortalEnabled,
        currency_id: this.currencyId,
        payment_terms: this.paymentTerms,
        payment_terms_label: this.paymentTermsLabel,
        notes: this.notes,
        exchange_rate: this.exchangeRate && parseFloat(this.exchangeRate),
        vat_treatment: this.vatTreatment,
        gst_no: this.gstNo,
        avatax_use_code: this.avataxUseCode,
        tax_id: this.taxId,
      }),
    });

    $.export("$summary", `Contact successfully created with Id: ${response.contact.contact_id}`);
    return response;
  },
};
