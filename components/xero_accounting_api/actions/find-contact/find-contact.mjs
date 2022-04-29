import { ConfigurationError } from "@pipedream/platform";
import {
  removeNullEntries,
  formatQueryString,
} from "../../common/common.util.mjs";
import xero_accounting_api from "../../xero_accounting_api.app.mjs";

export default {
  key: "xero_accounting_api-find-contact",
  name: "Find contact.  Optionally, create one if none are found",
  description:
    "Finds a contact by name or account number. Optionally, create one if none are found. [See the docs here](https://developer.xero.com/documentation/api/accounting/contacts/#get-contacts)",
  version: "0.0.1",
  type: "action",
  props: {
    xero_accounting_api,
    tenant_id: {
      propDefinition: [xero_accounting_api, "tenant_id"],
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
      description: "Create a new contact if not found.",
      type: "string",
      options: ["Yes", "No"],
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
        options: ["ACTIVE", "ARCHIVED", "GDPRREQUEST"],
        optional: true,
        default: "ACTIVE",
      };
    }
    return props;
  },
  async run({ $ }) {
    let contactDetail;
    const {
      tenant_id,
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
        "Only one of AccountNumber and Name is required to find contact"
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
      contactDetail = await this.xero_accounting_api.getContact(
        tenant_id,
        queryString
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
      const response = await this.xero_accounting_api.createContact(
        tenant_id,
        createPayload
      );
      response && $.export("$summary", "Contact created successfully");
      return response;
    }
    contactDetail && $.export("$summary", "Contact found");
    return contactDetail;
  },
};
