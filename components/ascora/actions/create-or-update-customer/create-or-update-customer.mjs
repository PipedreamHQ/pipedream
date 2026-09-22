import ascora from "../../ascora.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "ascora-create-or-update-customer",
  name: "Create or Update Customer",
  description: "Creates or updates a customer in the Ascora system. [See the documentation](https://www.ascora.com.au/Assets/Guides/AscoraApiGuide.pdf)",
  version: "0.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ascora,
    customerId: {
      propDefinition: [
        ascora,
        "customerId",
      ],
    },
    customerNumber: {
      type: "string",
      label: "Customer Number",
      description: "The customer number of the customer",
      optional: true,
    },
    companyName: {
      type: "string",
      label: "Company Name",
      description: "The company name of the customer",
      optional: true,
    },
    contactFirstName: {
      type: "string",
      label: "Contact First Name",
      description: "The first name of the contact of the customer",
      optional: true,
    },
    contactLastName: {
      type: "string",
      label: "Contact Last Name",
      description: "The last name of the contact of the customer",
      optional: true,
    },
    emailAddress: {
      type: "string",
      label: "Email Address",
      description: "The email address of the customer",
      optional: true,
    },
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "The phone number of the customer",
      optional: true,
    },
    streetLine1: {
      type: "string",
      label: "Street Line 1",
      description: "The first line of the street of the customer",
      optional: true,
    },
    streetLine2: {
      type: "string",
      label: "Street Line 2",
      description: "The second line of the street of the customer",
      optional: true,
    },
    streetSuburb: {
      type: "string",
      label: "Suburb",
      description: "The suburb of the customer",
      optional: true,
    },
    streetPostcode: {
      type: "string",
      label: "Postcode",
      description: "The postcode of the customer",
      optional: true,
    },
    streetState: {
      type: "string",
      label: "State",
      description: "The state of the customer",
      optional: true,
    },
    streetCountry: {
      type: "string",
      label: "Country",
      description: "The country of the customer",
      optional: true,
    },
    customerType: {
      type: "string",
      label: "Customer Type",
      description: "The type of the customer",
      optional: true,
    },
    leadSource: {
      type: "string",
      label: "Lead Source",
      description: "The source of the lead",
      optional: true,
    },
    customFields: {
      type: "string[]",
      label: "Custom Fields",
      description: `Custom fields of the customer

**Example:**
\`\`\`json
[
  {
    "fieldName": "Customer text",
    "fieldValue": "free text value test update"
  }
]
\`\`\``,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.ascora.createUpdateCustomer({
      $,
      data: {
        customerId: this.customerId,
        customerNumber: this.customerNumber,
        companyName: this.companyName,
        contactFirstName: this.contactFirstName,
        contactLastName: this.contactLastName,
        emailAddress: this.emailAddress,
        phoneNumber: this.phoneNumber,
        streetLine1: this.streetLine1,
        streetLine2: this.streetLine2,
        streetSuburb: this.streetSuburb,
        streetPostcode: this.streetPostcode,
        streetState: this.streetState,
        streetCountry: this.streetCountry,
        customerType: this.customerType
          ? {
            Name: this.customerType,
          }
          : undefined,
        leadSource: this.leadSource
          ? {
            Name: this.leadSource,
          }
          : undefined,
        customFields: parseObject(this.customFields),
      },
    });
    if (response.success) {
      $.export("$summary", `Successfully ${this.customerId
        ? "updated"
        : "created"} customer with ID: ${response.customer.customerId}`);
    } else {
      throw new Error(response.message);
    }
    return response;
  },
};
