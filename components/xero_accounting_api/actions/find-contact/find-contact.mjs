import { ConfigurationError } from "@pipedream/platform";
import {
  removeNullEntries, formatQueryString,
} from "../../common/util.mjs";
import xeroAccountingApi from "../../xero_accounting_api.app.mjs";

export default {
  key: "xero_accounting_api-find-contact",
  name: "Find contact.  Optionally, create one if none are found",
  description:
    "Finds a contact by name or account number. Optionally, create one if none are found. [See the docs here](https://developer.xero.com/documentation/api/accounting/contacts/#get-contacts)",
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
    Name: {
      type: "string",
      label: "Contact name",
      description: "Full name of contact/organisation ",
      optional: true,
    },
    AccountNumber: {
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
      props.Name = {
        type: "string",
        label: "Contact name",
        description: "Full name of contact/organisation.",
      };
      props.FirstName = {
        type: "string",
        label: "First name",
        description: "First name of contact person .",
        optional: true,
      };
      props.LastName = {
        type: "string",
        label: "Last name",
        description: "Last name of contact person.",
        optional: true,
      };
      props.EmailAddress = {
        type: "string",
        label: "Email address",
        description: "Email address of contact person.",
        optional: true,
      };
      props.ContactStatus = {
        type: "string",
        label: "Contact status",
        description:
          "See https://developer.xero.com/documentation/api/accounting/types#contacts",
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
      Name,
      FirstName,
      LastName,
      EmailAddress,
      AccountNumber,
      ContactStatus,
      createContactIfNotFound,
    } = this;
    if (createContactIfNotFound === "No" && AccountNumber && Name) {
      throw new ConfigurationError(
        "Only one of AccountNumber and Name is required to find contact",
      );
    }
    const findPayload = removeNullEntries({
      Name,
      AccountNumber,
    });
    const createPayload = removeNullEntries({
      Name,
      FirstName,
      LastName,
      EmailAddress,
      AccountNumber,
      ContactStatus,
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
