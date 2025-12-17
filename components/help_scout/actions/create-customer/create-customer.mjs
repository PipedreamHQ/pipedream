import { ConfigurationError } from "@pipedream/platform";
import {
  GENDER_OPTIONS,
  PHOTO_TYPE_OPTIONS,
} from "../../common/constants.mjs";
import {
  cleanObject,
  parseObject,
} from "../../common/utils.mjs";
import helpScout from "../../help_scout.app.mjs";

export default {
  key: "help_scout-create-customer",
  name: "Create Customer",
  description: "Creates a new customer record in Help Scout. [See the documentation](https://developer.helpscout.com/mailbox-api/endpoints/customers/create/)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    helpScout,
    firstName: {
      type: "string",
      label: "First Name",
      description: "First name of the customer. When defined it must be between 1 and 40 characters.",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Last name of the customer. When defined it must be between 1 and 40 characters.",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "The phone number that will be used when creating a new customer.",
      optional: true,
    },
    photoUrl: {
      type: "string",
      label: "Photo URL",
      description: "URL of the customer's photo. Max length 200 characters.",
      optional: true,
    },
    jobTitle: {
      type: "string",
      label: "Job Title",
      description: "Job title. Max length 60 characters.",
      optional: true,
    },
    photoType: {
      type: "string",
      label: "Photo Type",
      description: "The type of photo.",
      options: PHOTO_TYPE_OPTIONS,
      optional: true,
    },
    background: {
      type: "string",
      label: "Background",
      description: "This is the Notes field from the user interface. Max length 200 characters.",
      optional: true,
    },
    location: {
      type: "string",
      label: "Location",
      description: "Location of the customer. Max length 60 characters.",
      optional: true,
    },
    organization: {
      type: "string",
      label: "Organization",
      description: "Organization. Max length 60 characters.",
      optional: true,
    },
    gender: {
      type: "string",
      label: "Gender",
      description: "Gender of this customer.",
      options: GENDER_OPTIONS,
      optional: true,
    },
    age: {
      type: "string",
      label: "Age",
      description: "Customer's age.",
      optional: true,
    },
    emails: {
      type: "string[]",
      label: "Emails",
      description: "List of email entries. **Format: {\"type\":\"home\",\"value\":\"customer@email.com\"}**. see [Create Email](https://developer.helpscout.com/mailbox-api/endpoints/customers/emails/create) for the object documentation.",
      optional: true,
    },
    phones: {
      type: "string[]",
      label: "Phones",
      description: "List of phone entries. **Format: {\"type\":\"work\",\"value\":\"222-333-4444\"}**. see [Create Phone](https://developer.helpscout.com/mailbox-api/endpoints/customers/phones/create) for the object documentation.",
      optional: true,
    },
    chats: {
      type: "string[]",
      label: "Chats",
      description: "List of chat entries. **Format: {\"type\":\"aim\",\"value\":\"jsprout\"}**. see [Create Chat Handle](https://developer.helpscout.com/mailbox-api/endpoints/customers/chat_handles/create) for the object documentation.",
      optional: true,
    },
    socialProfiles: {
      type: "string[]",
      label: "Social Profiles",
      description: "List of social profile entries. **Format: {\"type\":\"googleplus\",\"value\":\"https://api.helpscout.net/+HelpscoutNet\"}**. see [Create Social Profile](https://developer.helpscout.com/mailbox-api/endpoints/customers/social_profiles/create) for the object documentation.",
      optional: true,
    },
    websites: {
      type: "string[]",
      label: "Websites",
      description: "List of websites entries. **Format: {\"value\":\"https://api.helpscout.net/\"}**. see [Create Website](https://developer.helpscout.com/mailbox-api/endpoints/customers/websites/create) for the object documentation.",
      optional: true,
    },
    addressCity: {
      type: "string",
      label: "Address City",
      description: "The city of the customer.",
      optional: true,
    },
    addressState: {
      type: "string",
      label: "Address State",
      description: "The state of the customer.",
      optional: true,
    },
    addressPostalCode: {
      type: "string",
      label: "Address Postal Code",
      description: "The postal code of the customer.",
      optional: true,
    },
    addressCountry: {
      type: "string",
      label: "Address Country",
      description: "The [ISO 3166 Alpha-2 code](https://www.iban.com/country-codes) country of the customer.",
      optional: true,
    },
    addressLines: {
      type: "string[]",
      label: "Address Lines",
      description: "A list of address lines.",
      optional: true,
    },
    properties: {
      type: "string[]",
      label: "Properties",
      description: "List of social profile entries. **Format: {\"type\":\"googleplus\",\"value\":\"https://api.helpscout.net/+HelpscoutNet\"}**. see [Create Social Profile](https://developer.helpscout.com/mailbox-api/endpoints/customers/social_profiles/create) for the object documentation.",
      optional: true,
    },
  },
  async run({ $ }) {
    const address = cleanObject({
      city: this.addressCity,
      state: this.addressState,
      postalCode: this.addressPostalCode,
      country: this.addressCountry,
      lines: parseObject(this.addressLines),
      properties: parseObject(this.properties),
    });

    let data = {};

    data = cleanObject({
      firstName: this.firstName,
      lastName: this.lastName,
      phone: this.phone,
      photoUrl: this.photoUrl,
      jobTitle: this.jobTitle,
      photoType: this.photoType,
      background: this.background,
      location: this.location,
      organization: this.organization,
      gender: this.gender,
      age: this.age,
      emails: parseObject(this.emails),
      phones: parseObject(this.phones),
      chats: parseObject(this.chats),
      socialProfiles: parseObject(this.socialProfiles),
      websites: parseObject(this.websites),
    });

    if (Object.keys(address).length) data.address = address;

    if (!Object.keys(data).length) {
      throw new ConfigurationError("At least one field or customer entry must be defined.");
    }

    try {
      const response = await this.helpScout.createCustomer({
        $,
        data,
      });

      $.export("$summary", "Successfully created the new customer.");
      return response;
    } catch ({ message }) {
      const error = JSON.parse(message)._embedded.errors[0];
      throw new ConfigurationError(`Path: ${error.path} - ${error.message}`);
    }
  },
};
