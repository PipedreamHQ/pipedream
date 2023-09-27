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
    emailAddress: {
      type: "string",
      label: "Contact email address",
      description: "Email Address of contact/organization ",
      optional: true,
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
      props.companyNumber = {
        type: "string",
        label: "Company Number",
        description: "Company registration number.",
        optional: true,
      };
      props.addresses = {
        type: "string",
        label: "Address",
        description: "Store certain address for a contact",
        optional: true,
      };
      props.phones = {
        type: "string",
        label: "Phone",
        description: "Store certain phone number for a contact",
        optional: true,
      };
      props.defaultCurrency = {
        type: "string",
        label: "Default Currency",
        description: "Default currency (Currency Code) for raising invoices against contact",
        optional: true,
      };
      props.isSupplier = {
        type: "boolean",
        label: "Is Supplier",
        description: "Contact that has any AP invoices entered against them.",
        optional: true,
      };
      props.IsCustomer = {
        type: "boolean",
        label: "Is Customer",
        description: "Describes if a contact has any AR invoices entered against them.",
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
    if (createContactIfNotFound === "No" && accountNumber && name && emailAddress) {
      throw new ConfigurationError(
        "Choose exclusively between Account Number, Name or emailAddress to find a contact.",
      );
    }
    const findPayload = removeNullEntries({
      Name: name,
      AccountNumber: accountNumber,
      EmailAddress: emailAddress
    });
    const createPayload = removeNullEntries({
      Name: name,
      FirstName: firstName,
      LastName: lastName,
      EmailAddress: emailAddress,
      AccountNumber: accountNumber,
      ContactStatus: contactStatus,
      CompanyNumber: companyNumber,
      Addresses: addresses,
      Phones: phones,
      DefaultCurrency: defaultCurrency,
      IsSupplier: isSupplier,
      IsCustomer: isCustomer,
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
