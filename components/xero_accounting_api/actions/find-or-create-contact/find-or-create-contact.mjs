import xeroAccountingApi from "../../xero_accounting_api.app.mjs";
import { ConfigurationError } from "@pipedream/platform";
import {
  removeNullEntries, formatQueryString,
} from "../../common/util.mjs";

export default {
  key: "xero_accounting_api-find-or-create-contact",
  name: "Find or Create Contact",
  description: "Finds a contact by email address. Optionally, create one if none are found. [See the documentation](https://developer.xero.com/documentation/api/accounting/contacts/#get-contacts)",
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
    emailAddress: {
      type: "string",
      label: "Email address",
      description: "Email address of contact.",
    },
    createContactIfNotFound: {
      type: "boolean",
      label: "Create a new contact if not found",
      description: "Set to `true` to create a new contact if not found.",
      reloadProps: true,
    },
  },
  additionalProps() {
    const props = {};
    if (this.createContactIfNotFound) {
      props.name = {
        type: "string",
        label: "Contact name",
        description: "Full name of contact/organization.",
      };
      props.firstName = {
        type: "string",
        label: "First name",
        description: "First name of contact.",
        optional: true,
      };
      props.lastName = {
        type: "string",
        label: "Last name",
        description: "Last name of contact.",
        optional: true,
      };
      props.contactStatus = {
        type: "string",
        label: "Contact status",
        description: "See [contact status reference](https://developer.xero.com/documentation/api/accounting/types#contacts)",
        options: [
          "ACTIVE",
          "ARCHIVED",
          "GDPRREQUEST",
        ],
        optional: true,
        default: "ACTIVE",
      };
      props.companyNumber = {
        type: "string",
        label: "Company Number",
        description: "Company registration number. Max 50 char.",
        optional: true,
      };
      props.addressType = {
        type: "string",
        label: "Address Type",
        description: "The type of mailing address. Required if entering address information",
        options: [
          "POBOX",
          "STREET",
          "DELIVERY",
        ],
        optional: true,
      };
      props.addressLine1 = {
        type: "string",
        label: "Address Line 1",
        description: "Street address of contact",
        optional: true,
      };
      props.addressLine2 = {
        type: "string",
        label: "Address Line 2",
        description: "Line 2 of the street address of contact",
        optional: true,
      };
      props.city = {
        type: "string",
        label: "City",
        description: "City address of contact",
        optional: true,
      };
      props.region = {
        type: "string",
        label: "Region",
        description: "Region/State address of contact",
        optional: true,
      };
      props.postalCode = {
        type: "string",
        label: "Postal Code",
        description: "Postal Code address of contact",
        optional: true,
      };
      props.country = {
        type: "string",
        label: "Country",
        description: "Country of contact",
        optional: true,
      };
      props.phoneNumber = {
        type: "string",
        label: "Phone Number",
        description: "Phone number of contact",
        optional: true,
      };
    }
    return props;
  },
  async run({ $ }) {
    const queryString = formatQueryString({
      EmailAddress: this.emailAddress,
    }, true);
    const contactDetail = await this.xeroAccountingApi.getContact($, this.tenantId, queryString);
    const found = contactDetail?.Contacts?.length;

    if (!this.createContactIfNotFound && !found) {
      throw new ConfigurationError("Contact not found");
    }

    if (found) {
      $.export("$summary", `Successfully found contact with email \`${this.emailAddress}\`.`);
      return contactDetail;
    }

    const addressEntered = this.addressLine1
      || this.addressLine1
      || this.city
      || this.region
      || this.postalCode
      || this.country;
    if (addressEntered && !this.addressType) {
      throw new ConfigurationError("Address Type is required when entering address information.");
    } else if (!addressEntered && this.addressType) {
      throw new ConfigurationError("Must enter address information along with Address Type.");
    }

    const createPayload = removeNullEntries({
      Name: this.name,
      FirstName: this.firstName,
      LastName: this.lastName,
      EmailAddress: this.emailAddress,
      ContactStatus: this.contactStatus,
      CompanyNumber: this.companyNumber,
      Addresses: addressEntered
        ? [
          {
            AddressType: this.addressType,
            AddressLine1: this.addressLine1,
            AddressLine2: this.addressLine1,
            City: this.city,
            Region: this.region,
            PostalCode: this.postalCode,
            Country: this.country,
          },
        ]
        : undefined,
      Phones: this.phoneNumber
        ? [
          {
            PhoneType: "DEFAULT",
            PhoneNumber: this.phoneNumber,
          },
        ]
        : undefined,
    });

    const response = await this.xeroAccountingApi.createContact($, this.tenantId, createPayload);
    if (response?.Contacts?.length) {
      $.export("$summary", `Successfully created new contact with ID ${response.Contacts[0].ContactID}.`);
    }
    return response;
  },
};
