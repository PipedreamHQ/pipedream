import app from "../../sperse.app.mjs";
import { parseArray } from "../../common/utils.mjs";

export default {
  key: "sperse-add-or-update-contact",
  name: "Add or Update Contact",
  description: "Creates or updates a contact. [See the documentation](https://app.sperse.com/app/api/swagger)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    // eslint-disable-next-line pipedream/props-label, pipedream/props-description
    info: {
      type: "alert",
      alertType: "info",
      content: "At least one of the following fields is required: **First Name** or **Last Name**, **Company**, **Email** or **Phone**",
    },
    contactId: {
      description: "The ID of the contact to update. Leave empty to create a new contact.",
      optional: true,
      propDefinition: [
        app,
        "contactId",
      ],
    },
    contactGroupId: {
      propDefinition: [
        app,
        "contactGroupId",
      ],
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the contact",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the contact",
      optional: true,
    },
    companyName: {
      type: "string",
      label: "Company Name",
      description: "The company name of the contact",
      optional: true,
    },
    emailAddresses: {
      type: "string[]",
      label: "Email Addresses",
      description: `An array of email objects.

**Example:**
\`\`\`json
[
  {
    "emailAddress": "jane.doe@gmail.com",
    "isActive": true,
    "isConfirmed": true,
    "comment": "Primary work email",
    "usageTypeId": "H"
  }
]
\`\`\``,
      optional: true,
    },
    phoneNumbers: {
      type: "string[]",
      label: "Phone Numbers",
      description: `An array of phone objects.

**Example:**
\`\`\`json
[
  {
    "phoneNumber": "+14155552671",
    "phoneExtension": "101",
    "isActive": true,
    "isConfirmed": false,
    "comment": "Direct work line",
    "usageTypeId": "C"
  }
]
\`\`\``,
      optional: true,
    },
    addresses: {
      type: "string[]",
      label: "Addresses",
      description: `Array of address objects.

**Example:**
\`\`\`json
[
  {
    "contactId": 12345,
    "startDate": "2026-02-13",
    "endDate": "2026-02-13",
    "isActive": true,
    "isConfirmed": true,
    "usageTypeId": "H",
    "ownershipTypeId": "O",
    "streetAddress": "123 Main St",
    "neighborhood": "Main St",
    "city": "New York",
    "stateId": "NY",
    "stateName": "New York",
    "zip": "10001",
    "countryId": "US",
    "countryName": "United States",
    "comment": "Home address"
  }
]
\`\`\``,
      optional: true,
    },
    note: {
      type: "string",
      label: "Note",
      description: "Additional notes about the contact",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app,
      contactId,
      contactGroupId,
      firstName,
      lastName,
      companyName,
      emailAddresses,
      phoneNumbers,
      addresses,
      note,
    } = this;

    const response = await app.createOrUpdateContact({
      $,
      data: {
        contactId,
        contactGroupId,
        firstName,
        lastName,
        companyName,
        emailAddresses: parseArray(emailAddresses),
        phoneNumbers: parseArray(phoneNumbers),
        addresses: parseArray(addresses),
        note,
      },
    });

    $.export("$summary", `Successfully created/updated contact with ID \`${response.result?.contactId ?? "unknown"}\``);

    return response;
  },
};
