import { ConfigurationError } from "@pipedream/platform";
import app from "../../sage_accounting.app.mjs";
import {
  CREDIT_TERMS_OPTIONS, LOCALE_OPTIONS,
} from "../../common/constants.mjs";

export default {
  key: "sage_accounting-create-contact",
  name: "Create Contact",
  description: "Creates a new contact in Sage Accounting. [See the documentation](https://developer.sage.com/accounting/reference/contacts/#tag/Contacts/operation/postContacts)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    name: {
      type: "string",
      label: "Name",
      description: "The contact's full name or business name",
    },
    contactTypeIds: {
      propDefinition: [
        app,
        "contactTypeIds",
      ],
    },
    reference: {
      type: "string",
      label: "Reference",
      description: "Unique reference for the contact",
      optional: true,
    },
    taxNumber: {
      type: "string",
      label: "Tax Number",
      description: "The VAT registration number of the contact. The format will be validated.",
      optional: true,
    },
    notes: {
      type: "string",
      label: "Notes",
      description: "The notes for the contact",
      optional: true,
    },
    locale: {
      type: "string",
      label: "Locale",
      description: "The locale for the contact",
      optional: true,
      options: LOCALE_OPTIONS,
    },
    creditLimit: {
      type: "string",
      label: "Credit Limit",
      description: "Custom credit limit amount for the contact (not applicable to Start)",
      optional: true,
    },
    creditDays: {
      type: "integer",
      label: "Credit Days",
      description: "Custom credit days for the contact (0-365 days)",
      optional: true,
      min: 0,
      max: 365,
    },
    creditTerms: {
      type: "string",
      label: "Credit Terms",
      description: "Credit terms options determine how invoice due dates are calculated",
      optional: true,
      options: CREDIT_TERMS_OPTIONS,
    },
    creditTermsAndConditions: {
      type: "string",
      label: "Credit Terms and Conditions",
      description: "Custom terms and conditions for the contact (Customers only)",
      optional: true,
    },
    currencyId: {
      propDefinition: [
        app,
        "currencyId",
      ],
    },
    auxReference: {
      type: "string",
      label: "Auxiliary Reference",
      description: "Auxiliary reference. Used for German 'Kreditorennummer' and 'Debitorennummer'",
      optional: true,
    },
    registeredNumber: {
      type: "string",
      label: "Registered Number",
      description: "The registered number of the contact's business (German 'Steuernummer')",
      optional: true,
    },
    taxCalculation: {
      type: "string",
      label: "Tax Calculation",
      description: "Tax calculation method (France: tax treatment for Vendors, Spain: Recargo de Equivalencia for Customers, UK: domestic reverse charge)",
      optional: true,
    },
    auxiliaryAccount: {
      type: "string",
      label: "Auxiliary Account",
      description: "Auxiliary account - used when auxiliary accounting is enabled (Spain and France only)",
      optional: true,
    },
    destinationVatBlocking: {
      type: "boolean",
      label: "Destination VAT Blocking",
      description: "Identifies if a contact should be blocked due to destination VAT",
      optional: true,
    },
    defaultSalesLedgerAccountId: {
      type: "string",
      label: "Default Sales Ledger Account ID",
      description: "The ID of the default sales ledger account for the contact",
      optional: true,
    },
    defaultSalesTaxRateId: {
      type: "string",
      label: "Default Sales Tax Rate ID",
      description: "The ID of the default sales tax rate for the contact",
      optional: true,
    },
    defaultPurchaseLedgerAccountId: {
      type: "string",
      label: "Default Purchase Ledger Account ID",
      description: "The ID of the default purchase ledger account for the contact",
      optional: true,
    },
    productSalesPriceTypeId: {
      type: "string",
      label: "Product Sales Price Type ID",
      description: "The ID of the product sales price type for the contact",
      optional: true,
    },
    sourceGuid: {
      type: "string",
      label: "Source GUID",
      description: "The GUID of the source for the contact",
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.name) {
      throw new ConfigurationError("Name is required");
    }
    if (!this.contactTypeIds || this.contactTypeIds.length === 0) {
      throw new ConfigurationError("At least one Contact Type ID is required");
    }

    const response = await this.app.createContact({
      $,
      data: {
        name: this.name,
        contact_type_ids: this.contactTypeIds,
        reference: this.reference,
        default_sales_ledger_account_id: this.defaultSalesLedgerAccountId,
        default_sales_tax_rate_id: this.defaultSalesTaxRateId,
        default_purchase_ledger_account_id: this.defaultPurchaseLedgerAccountId,
        tax_number: this.taxNumber,
        notes: this.notes,
        locale: this.locale,
        credit_limit: this.creditLimit,
        credit_days: this.creditDays,
        credit_terms: this.creditTerms,
        credit_terms_and_conditions: this.creditTermsAndConditions,
        product_sales_price_type_id: this.productSalesPriceTypeId,
        source_guid: this.sourceGuid,
        currency_id: this.currencyId,
        aux_reference: this.auxReference,
        registered_number: this.registeredNumber,
        tax_calculation: this.taxCalculation,
        auxiliary_account: this.auxiliaryAccount,
        destination_vat_blocking: this.destinationVatBlocking,
      },
    });

    $.export("$summary", `Successfully created contact: ${response.name || response.displayed_as}`);
    return response;
  },
};
