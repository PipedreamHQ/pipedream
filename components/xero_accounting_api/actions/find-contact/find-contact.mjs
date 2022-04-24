import { ConfigurationError } from "@pipedream/platform";
import {
  removeNullEntries,
  formatQueryString,
} from "../../common/common.util.mjs";
import xero_accounting_api from "../../xero_accounting_api.app.mjs";

export default {
  key: "xero_accounting_api-find-contact",
  name: "Find Contact",
  description:
    "Finds a contact by name or account number.  Optionally, create one if none are found",
  version: "0.0.1",
  type: "action",
  props: {
    xero_accounting_api,
    tenant_id: {
      propDefinition: [xero_accounting_api, "tenant_id"],
    },
    Name: {
      type: "string",
      description: "Full name of contact/organisation ",
      optional: true,
    },
    AccountNumber: {
      type: "string",
      description:
        "Name of the contact associated to the bank transaction. If there is no contact matching this name, a new contact is created.",
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
      props.FirstName = {
        type: "string",
        description: "First name of contact person .",
        optional: true,
      };
      props.LastName = {
        type: "string",
        description: "Last name of contact person.",
        optional: true,
      };
      props.EmailAddress = {
        type: "string",
        description: "Email address of contact person.",
        optional: true,
      };
      props.ContactStatus = {
        type: "string",
        description:
          "See [Contact Status Codes](https://developer.xero.com/documentation/api/accounting/types#contacts)",
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

    if (!contactDetail && createContactIfNotFound === "Yes") {
      try {
        const response = await this.xero_accounting_api.createContact(
          tenant_id,
          createPayload
        );
        console.log("response", response);
        response && $.export("$summary", "Contact created successfully");
        return response;
      } catch (error) {
        throw new ConfigurationError("An error occured creating Contact");
      }
    }
    console.log("contactDetail", contactDetail);
    contactDetail && $.export("$summary", "Contact found");
    return contactDetail;
  },
};
