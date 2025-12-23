import { ADDRESS_TYPE_OPTIONS } from "../../common/constants.mjs";
import { parseObject } from "../../common/utils.mjs";
import constantContact from "../../constant_contact.app.mjs";

export default {
  key: "constant_contact-create-or-update-contact",
  name: "Create Or Update Contact",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Create a new contact or update an existing one based on their email address. This method is appropriate when a contact has given explicit permission to receive emails. [See the documentation](https://developer.constantcontact.com/api_reference/index.html#tag/Contacts/operation/createOrUpdateContact)",
  type: "action",
  props: {
    constantContact,
    emailAddress: {
      propDefinition: [
        constantContact,
        "emailAddress",
      ],
      description: "The email address for the contact. This method identifies each unique contact using their email address. If the email address exists in the account, this method updates the contact. If the email address is new, this method creates a new contact",
    },
    firstName: {
      propDefinition: [
        constantContact,
        "firstName",
      ],
      optional: true,
    },
    lastName: {
      propDefinition: [
        constantContact,
        "lastName",
      ],
      optional: true,
    },
    jobTitle: {
      propDefinition: [
        constantContact,
        "jobTitle",
      ],
      optional: true,
    },
    companyName: {
      type: "string",
      label: "Company Name",
      description: "The name of the company where the contact works",
      optional: true,
    },
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "The phone number of the contact",
      optional: true,
    },
    listMemberships: {
      propDefinition: [
        constantContact,
        "listMemberships",
      ],
      description: "Array of lists to which the contact is being subscribed, up to a maximum of 50. At least one list is required",
    },
    customFields: {
      type: "string[]",
      label: "Custom Fields",
      description: "The custom fields you want to add to the contact as an array of up to 50 custom field objects",
      optional: true,
    },
    anniversary: {
      type: "string",
      label: "Anniversary",
      description: "The anniversary date for the contact. For example, this value could be the date when the contact first became a customer of an organization in Constant Contact. Valid date formats are MM/DD/YYYY, M/D/YYYY, YYYY/MM/DD, YYYY/M/D, YYYY-MM-DD, YYYY-M-D,M-D-YYYY, or M-DD-YYYY",
      optional: true,
    },
    addressType: {
      type: "string",
      label: "Address Type",
      description: "The type of street address for the contact",
      options: ADDRESS_TYPE_OPTIONS,
      optional: true,
    },
    addressStreet: {
      type: "string",
      label: "Address Street",
      description: "The number and street of the contact's address",
      optional: true,
    },
    addressCity: {
      type: "string",
      label: "Address City",
      description: "The name of the city for the contact's address",
      optional: true,
    },
    addressState: {
      type: "string",
      label: "Address State",
      description: "The name of the state or province for the contact's address",
      optional: true,
    },
    addressPostalCode: {
      type: "string",
      label: "Address Postal Code",
      description: "The zip or postal code for the contact's address",
      optional: true,
    },
    addressCountry: {
      type: "string",
      label: "Address Country",
      description: "The name of the country for the contact's address",
      optional: true,
    },
    smsAddress: {
      type: "string",
      label: "SMS Address",
      description: "The contact's SMS-capable phone number, excluding the country code",
      optional: true,
    },
    dialCode: {
      type: "string",
      label: "Dial Code",
      description: "The dial code the country uses. For example, use `1` for the United States dial code",
      optional: true,
    },
    countryCode: {
      type: "string",
      label: "Country Code",
      description: "The two-digit code that identifies the country",
      optional: true,
    },
    smsChannelConsents: {
      type: "string[]",
      label: "SMS Channel Consents",
      description: "An array of up to 50 objects that describe the contact's SMS channel consents. [See the documentation](https://developer.constantcontact.com/api_reference/index.html#tag/Contacts/operation/createOrUpdateContact) for more information",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      email_address: this.emailAddress,
      first_name: this.firstName,
      last_name: this.lastName,
      job_title: this.jobTitle,
      company_name: this.companyName,
      phone_number: this.phoneNumber,
      list_memberships: parseObject(this.listMemberships),
      custom_fields: parseObject(this.customFields),
      anniversary: this.anniversary,
      street_addresses: {
        kind: this.addressType,
        street: this.addressStreet,
        city: this.addressCity,
        state: this.addressState,
        postal_code: this.addressPostalCode,
        country: this.addressCountry,
      },
    };

    const smsChannel = {};
    if (this.smsAddress) {
      smsChannel.sms_address = this.smsAddress;
    }
    if (this.dialCode) {
      smsChannel.dial_code = this.dialCode;
    }
    if (this.countryCode) {
      smsChannel.country_code = this.countryCode;
    }
    if (this.smsChannelConsents) {
      smsChannel.sms_channel_consents = parseObject(this.smsChannelConsents);
    }
    if (Object.keys(smsChannel).length > 0) {
      data.sms_channel = smsChannel;
    }

    const response = await this.constantContact.createOrUpdateContact({
      $,
      data,
    });

    $.export("$summary", `Successfully **${response.action}** contact with ID: \`${response.contact_id}\``);
    return response;
  },
};

