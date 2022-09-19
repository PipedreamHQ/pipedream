// legacy_hash_id: a_EVi7zr
import { axios } from "@pipedream/platform";

export default {
  key: "quickbooks_sandbox-create-customer",
  name: "Create Customer",
  description: "Creates a customer.",
  version: "0.1.1",
  type: "action",
  props: {
    quickbooks_sandbox: {
      type: "app",
      app: "quickbooks_sandbox",
    },
    display_name: {
      type: "string",
      description: "The name of the person or organization as displayed. Must be unique across all Customer, Vendor, and Employee objects. Cannot be removed with sparse update. If not supplied, the system generates DisplayName by concatenating customer name components supplied in the request from the following list: `Title`, `GivenName`, `MiddleName`, `FamilyName`, and `Suffix`.",
      optional: true,
    },
    title: {
      type: "string",
      description: "Title of the person. This tag supports i18n, all locales. The `DisplayName` attribute or at least one of `Title`, `GivenName`, `MiddleName`, `FamilyName`, `Suffix`, or `FullyQualifiedName` attributes are required during create.",
      optional: true,
    },
    given_name: {
      type: "string",
      description: "Given name or first name of a person. The `DisplayName` attribute or at least one of `Title`, `GivenName`, `MiddleName`, `FamilyName`, or `Suffix` attributes is required for object create.",
      optional: true,
    },
    middle_name: {
      type: "string",
      description: "Middle name of the person. The person can have zero or more middle names. The `DisplayName` attribute or at least one of `Title`, `GivenName`, `MiddleName`, `FamilyName`, or `Suffix` attributes is required for object create.",
      optional: true,
    },
    family_name: {
      type: "string",
      description: "Family name or the last name of the person. The `DisplayName` attribute or at least one of `Title`, `GivenName`, `MiddleName`, `FamilyName`, or `Suffix` attributes is required for object create.",
      optional: true,
    },
    suffix: {
      type: "string",
      description: "Suffix of the name. For example, `Jr`. The `DisplayName` attribute or at least one of `Title`, `GivenName`, `MiddleName`, `FamilyName`, or `Suffix` attributes is required for object create.",
      optional: true,
    },
    minorversion: {
      type: "string",
      description: "Use the minorversion query parameter in REST API requests to access a version of the API other than the generally available version. For example, to invoke minor version 1 of the JournalEntry entity, issue the following request:\n`https://quickbooks.api.intuit.com/v3/company/<realmId>/journalentry/entityId?minorversion=1`",
      optional: true,
    },
  },
  async run({ $ }) {
  //See Quickbooks API docs at: https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/customer#create-a-customer

    if (!this.display_name && (!this.title && !this.given_name && !this.middle_name && !this.family_name && !this.suffix)) {
      throw new Error("Must provide display_name or at least one of title, given_name, middle_name, family_name, or suffix parameters.");
    }

    return await axios($, {
      method: "post",
      url: `https://sandbox-quickbooks.api.intuit.com/v3/company/${this.quickbooks_sandbox.$auth.company_id}/customer`,
      headers: {
        "Authorization": `Bearer ${this.quickbooks_sandbox.$auth.oauth_access_token}`,
        "accept": "application/json",
        "content-type": "application/json",
      },
      data: {
        DisplayName: this.display_name,
        Suffix: this.suffix,
        Title: this.title,
        MiddleName: this.middle_name,
        FamilyName: this.family_name,
        GivenName: this.given_name,
      },
      params: {
        minorversion: this.minorversion,
      },
    });
  },
};
