import { ConfigurationError } from "@pipedream/platform";
import quickbooks from "../../quickbooks.app.mjs";

export default {
  key: "quickbooks-create-customer",
  name: "Create Customer",
  description: "Creates a customer. [See docs here](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/customer#create-a-customer)",
  version: "0.1.2",
  type: "action",
  props: {
    quickbooks,
    displayName: {
      label: "Display Name",
      type: "string",
      description: "The name of the person or organization as displayed. Must be unique across all Customer, Vendor, and Employee objects. Cannot be removed with sparse update. If not supplied, the system generates DisplayName by concatenating customer name components supplied in the request from the following list: `Title`, `GivenName`, `MiddleName`, `FamilyName`, and `Suffix`.",
      optional: true,
    },
    title: {
      label: "Title",
      type: "string",
      description: "Title of the person. This tag supports i18n, all locales. The `DisplayName` attribute or at least one of `Title`, `GivenName`, `MiddleName`, `FamilyName`, `Suffix`, or `FullyQualifiedName` attributes are required during create.",
      optional: true,
    },
    givenName: {
      label: "Given Name",
      type: "string",
      description: "Given name or first name of a person. The `DisplayName` attribute or at least one of `Title`, `GivenName`, `MiddleName`, `FamilyName`, or `Suffix` attributes is required for object create.",
      optional: true,
    },
    middleName: {
      label: "Middle Name",
      type: "string",
      description: "Middle name of the person. The person can have zero or more middle names. The `DisplayName` attribute or at least one of `Title`, `GivenName`, `MiddleName`, `FamilyName`, or `Suffix` attributes is required for object create.",
      optional: true,
    },
    familyName: {
      label: "Family Name",
      type: "string",
      description: "Family name or the last name of the person. The `DisplayName` attribute or at least one of `Title`, `GivenName`, `MiddleName`, `FamilyName`, or `Suffix` attributes is required for object create.",
      optional: true,
    },
    suffix: {
      label: "Suffix",
      type: "string",
      description: "Suffix of the name. For example, `Jr`. The `DisplayName` attribute or at least one of `Title`, `GivenName`, `MiddleName`, `FamilyName`, or `Suffix` attributes is required for object create.",
      optional: true,
    },
    minorversion: {
      label: "Minor Version",
      type: "string",
      description: "Use the minorversion query parameter in REST API requests to access a version of the API other than the generally available version. For example, to invoke minor version 1 of the JournalEntry entity, issue the following request:\n`https://quickbooks.api.intuit.com/v3/company/<realmId>/journalentry/entityId?minorversion=1`",
      optional: true,
    },
  },
  async run({ $ }) {
    if (
      !this.displayName &&
      (!this.title && !this.givenName && !this.middleName && !this.familyName && !this.suffix)
    ) {
      throw new ConfigurationError("Must provide displayName or at least one of title, givenName, middleName, familyName, or suffix parameters.");
    }

    const response = await this.quickbooks.createCustomer({
      $,
      data: {
        DisplayName: this.displayName,
        Suffix: this.suffix,
        Title: this.title,
        MiddleName: this.middleName,
        FamilyName: this.familyName,
        GivenName: this.givenName,
      },
      params: {
        minorversion: this.minorversion,
      },
    });

    if (response) {
      $.export("summary", "Successfully created customer");
    }

    return response;
  },
};
