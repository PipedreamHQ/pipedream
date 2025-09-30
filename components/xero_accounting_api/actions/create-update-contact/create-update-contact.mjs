import { ConfigurationError } from "@pipedream/platform";
import { removeNullEntries } from "../../common/util.mjs";
import xeroAccountingApi from "../../xero_accounting_api.app.mjs";

export default {
  key: "xero_accounting_api-create-update-contact",
  name: "Create or update contact ",
  description: "Creates a new contact or updates a contact if a contact already exists. [See the docs here](https://developer.xero.com/documentation/api/accounting/contacts)",
  version: "0.1.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    xeroAccountingApi,
    tenantId: {
      propDefinition: [
        xeroAccountingApi,
        "tenantId",
      ],
    },
    contactID: {
      type: "string",
      label: "Contact ID",
      description: "ID of the contact that requires update.",
      optional: true,
    },
    name: {
      type: "string",
      label: "Contact name",
      description: "Full name of contact/organization.",
      optional: true,
    },
    firstName: {
      type: "string",
      label: "First name",
      description: "First name of contact person .",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last name",
      description: "Last name of contact person.",
      optional: true,
    },
    emailAddress: {
      type: "string",
      label: "Email address",
      description: "Email address of contact person.",
      optional: true,
    },
    accountNumber: {
      type: "string",
      label: "Account number",
      description: "User defined account number..",
      optional: true,
    },
    contactStatus: {
      type: "string",
      label: "Contact status",
      description:
        "See https://developer.xero.com/documentation/api/accounting/types#contacts",
      options: [
        "ACTIVE",
        "ARCHIVED",
        "GDPRREQUEST",
      ],
      default: "ACTIVE",
    },
  },
  async run({ $ }) {
    if (!this.contactID && !this.name) {
      throw new ConfigurationError("Must provide **Contact ID** or **Contact Name** parameter.");
    }
    const {
      contactID,
      tenantId,
      name,
      firstName,
      lastName,
      emailAddress,
      accountNumber,
      contactStatus,
    } = this;
    const data = removeNullEntries({
      Name: name,
      FirstName: firstName,
      LastName: lastName,
      EmailAddress: emailAddress,
      AccountNumber: accountNumber,
      ContactStatus: contactStatus,
    });
    contactID && (data.ContactID = contactID);
    const response = await this.xeroAccountingApi.createOrUpdateContact({
      $,
      tenantId,
      data,
    });
    response && $.export("$summary", "Contact created successfully");
    return response;
  },
};
