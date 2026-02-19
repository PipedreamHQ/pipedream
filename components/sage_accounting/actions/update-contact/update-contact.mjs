import app from "../../sage_accounting.app.mjs";

export default {
  key: "sage_accounting-update-contact",
  name: "Update Contact",
  description: "Updates an existing contact in Sage Accounting. [See the documentation](https://developer.sage.com/accounting/reference/contacts/#tag/Contacts/operation/putContactsKey)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    contactId: {
      propDefinition: [
        app,
        "contactId",
      ],
    },
    name: {
      propDefinition: [
        app,
        "name",
      ],
      optional: true,
    },
    contactTypeIds: {
      propDefinition: [
        app,
        "contactTypeIds",
      ],
      optional: true,
    },
    reference: {
      propDefinition: [
        app,
        "reference",
      ],
    },
    defaultSalesLedgerAccountId: {
      propDefinition: [
        app,
        "ledgerAccountId",
      ],
      label: "Default Sales Ledger Account ID",
      description: "The ID of the default sales ledger account for the contact",
    },
    defaultSalesTaxRateId: {
      propDefinition: [
        app,
        "defaultSalesTaxRateId",
      ],
    },
    defaultPurchaseLedgerAccountId: {
      propDefinition: [
        app,
        "ledgerAccountId",
      ],
      label: "Default Purchase Ledger Account ID",
      description: "The ID of the default purchase ledger account for the contact",
    },
    taxNumber: {
      propDefinition: [
        app,
        "taxNumber",
      ],
    },
    notes: {
      propDefinition: [
        app,
        "notes",
      ],
    },
    locale: {
      propDefinition: [
        app,
        "locale",
      ],
    },
    creditLimit: {
      propDefinition: [
        app,
        "creditLimit",
      ],
    },
    creditDays: {
      propDefinition: [
        app,
        "creditDays",
      ],
    },
    creditTerms: {
      propDefinition: [
        app,
        "creditTerms",
      ],
    },
    creditTermsAndConditions: {
      propDefinition: [
        app,
        "creditTermsAndConditions",
      ],
    },
    productSalesPriceTypeId: {
      propDefinition: [
        app,
        "productSalesPriceTypeId",
      ],
    },
    sourceGuid: {
      propDefinition: [
        app,
        "sourceGuid",
      ],
    },
    currencyId: {
      propDefinition: [
        app,
        "currencyId",
      ],
    },
    auxReference: {
      propDefinition: [
        app,
        "auxReference",
      ],
    },
    registeredNumber: {
      propDefinition: [
        app,
        "registeredNumber",
      ],
    },
    taxCalculation: {
      propDefinition: [
        app,
        "taxCalculation",
      ],
    },
    auxiliaryAccount: {
      propDefinition: [
        app,
        "auxiliaryAccount",
      ],
    },
    destinationVatBlocking: {
      propDefinition: [
        app,
        "destinationVatBlocking",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.updateContact({
      $,
      contactId: this.contactId,
      data: {
        contact: {
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
      },
    });

    $.export("$summary", `Successfully updated contact: ${response.name || response.displayed_as}`);
    return response;
  },
};
