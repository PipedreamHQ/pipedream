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
      propDefinition: [
        quickbooks,
        "displayName",
      ],
    },
    title: {
      propDefinition: [
        quickbooks,
        "title",
      ],
    },
    givenName: {
      propDefinition: [
        quickbooks,
        "givenName",
      ],
    },
    middleName: {
      propDefinition: [
        quickbooks,
        "middleName",
      ],
    },
    familyName: {
      propDefinition: [
        quickbooks,
        "familyName",
      ],
    },
    suffix: {
      propDefinition: [
        quickbooks,
        "suffix",
      ],
    },
    minorVersion: {
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
        minorversion: this.minorVersion,
      },
    });

    if (response) {
      $.export("summary", `Successfully created customer with id ${response.Customer.Id}`);
    }

    return response;
  },
};
