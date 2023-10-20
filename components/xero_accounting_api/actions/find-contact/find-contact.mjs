import { ConfigurationError } from "@pipedream/platform";
import {
  removeNullEntries, formatQueryString,
} from "../../common/util.mjs";
import xeroAccountingApi from "../../xero_accounting_api.app.mjs";

export default {
  key: "xero_accounting_api-find-contact",
  name: "Find contact.  Optionally, create one if none are found",
  description: "Finds a contact by name or account number. Optionally, create one if none are found. [See the docs here](https://developer.xero.com/documentation/api/accounting/contacts/#get-contacts)",
  version: "0.0.2",
  type: "action",
  props: {
    xeroAccountingApi,
    tenantId: {
      propDefinition: [
        xeroAccountingApi,
        "tenantId",
      ],
    },
    name: {
      type: "string",
      label: "Contact name",
      description: "Full name of contact/organization ",
      optional: true,
    },
    accountNumber: {
      type: "string",
      label: "Account number",
      description: "Account number of Contact.",
      optional: true,
    },
    createContactIfNotFound: {
      description: "Create a new contact if not found?.",
      label: "Create a new contact if not found",
      type: "string",
      options: [
        "Yes",
        "No",
      ],
      reloadProps: true,
    },
  },
  additionalProps() {
    const props = {};
    if (this.createContactIfNotFound === "Yes") {
      props.name = {
        type: "string",
        label: "Contact name",
        description: "Full name of contact/organization.",
      };
      props.firstName = {
        type: "string",
        label: "First name",
        description: "First name of contact person .",
        optional: true,
      };
      props.lastName = {
        type: "string",
        label: "Last name",
        description: "Last name of contact person.",
        optional: true,
      };
      props.emailAddress = {
        type: "string",
        label: "Email address",
        description: "Email address of contact person.",
        optional: true,
      };
      props.contactStatus = {
        type: "string",
        label: "Contact status",
        description:
          "See [contact status reference](https://developer.xero.com/documentation/api/accounting/types#contacts)",
        options: [
          "ACTIVE",
          "ARCHIVED",
          "GDPRREQUEST",
        ],
        optional: true,
        default: "ACTIVE",
      };
    }
    return props;
  },
  async run({ $ }) {
    let contactDetail;
    const {
      tenantId,
      name,
      firstName,
      lastName,
      emailAddress,
      accountNumber,
      contactStatus,
      createContactIfNotFound,
    } = this;
    if (createContactIfNotFound === "No" && accountNumber && name) {
      throw new ConfigurationError(
        "Choose exclusively between Account Number or Name to find a contact.",
      );
    }
    const findPayload = removeNullEntries({
      Name: name,
      AccountNumber: accountNumber,
    });
    const createPayload = removeNullEntries({
      Name: name,
      FirstName: firstName,
      LastName: lastName,
      EmailAddress: emailAddress,
      AccountNumber: accountNumber,
      ContactStatus: contactStatus,
    });
    const queryString = formatQueryString(findPayload, true);
    try {
      contactDetail = await this.xeroAccountingApi.getContact(
        $,
        tenantId,
        queryString,
      );
    } catch (error) {
      if (createContactIfNotFound === "Yes") {
        $.export("$summary", "Contact not found. Creating new contact");
      } else {
        throw new ConfigurationError("Contact not found");
      }
    }

    if (
      (!contactDetail || !contactDetail?.Contacts?.length) &&
      createContactIfNotFound === "Yes"
    ) {
      return await this.xeroAccountingApi.createContact(
        $,
        tenantId,
        createPayload,
      );
    }
    return contactDetail;
  },
};
