import { axios, ConfigurationError } from "@pipedream/platform";
import { removeNullEntries } from "../../common/common.util.mjs";

export default {
  key: "xero_accounting_api-create-update-contact",
  name: "Creates a new contact or updates a contact if a contact already exists",
  version: "0.0.1",
  type: "action",
  props: {
    xero_accounting_api: {
      type: "app",
      app: "xero_accounting_api",
    },
    tenant_id: {
      type: "string",
      description:
        "Id of the organization tenant to use on the Xero Accounting API. See [Get Tenant Connections](https://pipedream.com/@sergio/xero-accounting-api-get-tenant-connections-p_OKCzOgn/edit) for a workflow example on how to pull this data.",
    },
    actionType: {
      label: "Type of action to be performed.",
      description: "This triggers an update if UPDATE is selected",
      type: "string",
      options: ["NEW", "UPDATE"],
      reloadProps: true,
    },
    Name: {
      type: "string",
      description: "Full name of contact/organisation.",
    },
    FirstName: {
      type: "string",
      description: "First name of contact person .",
      optional: true,
    },
    LastName: {
      type: "string",
      description: "Last name of contact person.",
      optional: true,
    },
    EmailAddress: {
      type: "string",
      description: "Email address of contact person.",
      optional: true,
    },
    AccountNumber: {
      type: "string",
      description:
        "Name of the contact associated to the bank transaction. If there is no contact matching this name, a new contact is created.",
      optional: true,
    },
    ContactStatus: {
      type: "string",
      description:
        "See [Contact Status Codes](https://developer.xero.com/documentation/api/accounting/types#contacts)",
      options: ["ACTIVE", "ARCHIVED", "GDPRREQUEST"],
      default: "ACTIVE",
    },
  },
  async additionalProps() {
    const props = {};
    if (this.actionType === "UPDATE") {
      props.ContactID = {
        type: "string",
        description: "ID of the contact that requires update.",
      };
    }
    return props;
  },
  async run({ $ }) {
    const {
      ContactID,
      tenant_id,
      Name,
      FirstName,
      LastName,
      EmailAddress,
      AccountNumber,
      ContactStatus,
      actionType,
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
    if (!ContactID && actionType === "UPDATE") {
      throw new ConfigurationError(
        "ContactID must be set if actionType is UPDATE"
      );
    }
    try {
      console.log(this.xero_accounting_api.$auth.oauth_access_token);
      const response = await axios($, {
        method: "post",
        url: "https://api.xero.com/api.xro/2.0/contacts",
        headers: {
          Authorization: `Bearer ${this.xero_accounting_api.$auth.oauth_access_token}`,
          "xero-tenant-id": tenant_id,
        },
        data,
      });
      response &&
        $.export(
          "$summary",
          `Contact successfully ${
            actionType === "UPDATE" ? "updated" : "created"
          }`
        );
      return response;
    } catch (error) {
      throw new ConfigurationError(
        `An error occured ${
          actionType === "UPDATE" ? "updating" : "creating"
        } contact`
      );
    }
  },
};
