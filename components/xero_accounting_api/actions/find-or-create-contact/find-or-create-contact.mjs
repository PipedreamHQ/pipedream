import { ConfigurationError } from "@pipedream/platform";
import {
  formatQueryString,
  removeNullEntries,
} from "../../common/util.mjs";
import xeroAccountingApi from "../../xero_accounting_api.app.mjs";

export default {
  key: "xero_accounting_api-find-or-create-contact",
  name: "Find or Create Contact",
  description: "Finds a contact by name or email address. Optionally, create one if none are found. [See the docs here](https://developer.xero.com/documentation/api/accounting/contacts/#get-contacts)",
  version: "0.1.0",
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
    emailAddress: {
      type: "string",
      label: "Email address",
      description: "Email address of contact/organization.",
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
      contactStatus,
      createContactIfNotFound,
    } = this;
    if (createContactIfNotFound === "No" && emailAddress && name) {
      throw new ConfigurationError(
        "Choose exclusively between Email Address or Name to find a contact.",
      );
    }
    const findPayload = removeNullEntries({
      Name: name,
      EmailAddress: emailAddress,
    });
    const createPayload = removeNullEntries({
      Name: name,
      FirstName: firstName,
      LastName: lastName,
      EmailAddress: emailAddress,
      ContactStatus: contactStatus,
    });
    try {
      contactDetail = await this.xeroAccountingApi.getContact({
        $,
        tenantId,
        queryParam: formatQueryString(findPayload, true),
      });
    } catch (error) {
      if (createContactIfNotFound === "Yes") {
        $.export("$summary", "Contact not found. Creating new contact");
      } else {
        $.export("$summary", "No contact found.");
        return {};
      }
    }

    if (
      (!contactDetail || !contactDetail?.Contacts?.length) &&
      createContactIfNotFound === "Yes"
    ) {
      return await this.xeroAccountingApi.createOrUpdateContact({
        $,
        tenantId,
        data: createPayload,
      });
    }
    return contactDetail;
  },
};
