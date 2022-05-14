import { removeNullEntries } from "../../common/util.mjs";
import xeroAccountingApi from "../../xero_accounting_api.app.mjs";

export default {
  key: "xero_accounting_api-create-update-contact",
  name: "Create or update contact ",
  description:
    "Creates a new contact or updates a contact if a contact already exists. [See the docs here](https://developer.xero.com/documentation/api/accounting/contacts)",
  version: "0.0.1",
  type: "action",
  props: {
    xeroAccountingApi,
    tenantId: {
      propDefinition: [
        xeroAccountingApi,
        "tenantId",
      ],
    },
    actionType: {
      label: "Type of action",
      description: "This triggers an update if UPDATE is selected",
      type: "string",
      options: [
        "NEW",
        "UPDATE",
      ],
      reloadProps: true,
    },
    Name: {
      type: "string",
      label: "Contact name",
      description: "Full name of contact/organisation.",
      optional: true,
    },
    FirstName: {
      type: "string",
      label: "First name",
      description: "First name of contact person .",
      optional: true,
    },
    LastName: {
      type: "string",
      label: "Last name",
      description: "Last name of contact person.",
      optional: true,
    },
    EmailAddress: {
      type: "string",
      label: "Email address",
      description: "Email address of contact person.",
      optional: true,
    },
    AccountNumber: {
      type: "string",
      label: "Account number",
      description: "User defined account number..",
      optional: true,
    },
    ContactStatus: {
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
  async additionalProps() {
    const props = {};
    if (this.actionType === "UPDATE") {
      props.ContactID = {
        type: "string",
        label: "Contact ID",
        description: "ID of the contact that requires update.",
      };
      props.Name = {
        type: "string",
        description: "Full name of contact/organisation.",
        optional: true,
      };
    }
    return props;
  },
  async run({ $ }) {
    const {
      ContactID,
      tenantId,
      Name,
      FirstName,
      LastName,
      EmailAddress,
      AccountNumber,
      ContactStatus,
    } = this;
    const data = removeNullEntries({
      Name,
      FirstName,
      LastName,
      EmailAddress,
      AccountNumber,
      ContactStatus,
    });
    ContactID && (data.ContactID = ContactID);
    const response = await this.xeroAccountingApi.createContact($, tenantId, data);
    response && $.export("$summary", "Contact created successfully");
    return response;
  },
};
