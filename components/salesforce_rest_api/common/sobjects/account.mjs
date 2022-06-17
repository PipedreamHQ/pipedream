export default {
  AccountNumber: {
    type: "string",
    label: "Account Number",
    description: "Account number assigned to this account (not the unique, system-generated ID assigned during creation). Maximum size is 40 characters.",
  },
  AccountSource: {
    type: "string",
    label: "Account Source",
    description: "The source of the account record. For example, Advertisement, Data.com, or Trade Show. The source is selected from a picklist of available values, which are set by an administrator in Salesforce. Each picklist value can have up to 40 characters.",
  },
  AnnualRevenue: {
    type: "string",
    label: "Annual Revenue",
    description: "Estimated annual revenue of the account.",
  },
  BillingCity: {
    type: "string",
    label: "Billing City",
    description: "Details for the billing address of this account. Maximum size is 40 characters.",
  },
  BillingCountry: {
    type: "string",
    label: "Billing Country",
    description: "Details for the billing address of this account. Maximum size is 80 characters.",
  },
};
