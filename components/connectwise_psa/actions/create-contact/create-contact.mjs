import { parseObjectEntries } from "../../common/utils.mjs";
import connectwise from "../../connectwise_psa.app.mjs";

export default {
  key: "connectwise_psa-create-contact",
  name: "Create Contact",
  description: "Creates a new contact in Connectwise. [See the documentation](https://developer.connectwise.com/Products/ConnectWise_PSA/REST#/Contacts/postCompanyContacts)",
  version: "0.1.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    connectwise,
    firstName: {
      type: "string",
      label: "First Name",
      description: "First name of the contact",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Last name of the contact",
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email address of the contact",
      optional: true,
    },
    types: {
      propDefinition: [
        connectwise,
        "contactTypes",
      ],
    },
    company: {
      propDefinition: [
        connectwise,
        "company",
      ],
      optional: true,
    },
    relationship: {
      propDefinition: [
        connectwise,
        "relationship",
      ],
    },
    department: {
      propDefinition: [
        connectwise,
        "department",
      ],
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Phone number of the contact",
      optional: true,
    },
    address1: {
      type: "string",
      label: "Address Line 1",
      description: "First line of the contact's address",
      optional: true,
    },
    address2: {
      type: "string",
      label: "Address Line 2",
      description: "Second line of the contact's address",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "City of the contact",
      optional: true,
    },
    state: {
      type: "string",
      label: "State",
      description: "State of the contact",
      optional: true,
    },
    zip: {
      type: "string",
      label: "Zip",
      description: "Zip code of the contact",
      optional: true,
    },
    country: {
      propDefinition: [
        connectwise,
        "country",
      ],
    },
    isDefault: {
      type: "boolean",
      label: "Primary Contact",
      description: "Whether the contact is the primary (default) contact for the company",
      optional: true,
    },
    additionalOptions: {
      type: "object",
      label: "Additional Options",
      description: "Additional parameters to send in the request. [See the documentation](https://developer.connectwise.com/Products/ConnectWise_PSA/REST#/Contacts/postCompanyContacts) for available parameters. Values will be parsed as JSON where applicable.",
      optional: true,
    },
  },
  async run({ $ }) {
    const communicationItems = [];
    if (this.email) {
      communicationItems.push({
        value: this.email,
        type: {
          id: 1, // email
        },
      });
    }
    if (this.phone) {
      communicationItems.push({
        value: this.phone,
        type: {
          id: 2, // phone
        },
      });
    }
    const types = this.types.map((type) => ({
      id: type,
    }));
    const response = await this.connectwise.createContact({
      $,
      data: {
        firstName: this.firstName,
        lastName: this.lastName,
        addressLine1: this.address1,
        addressLine2: this.address2,
        city: this.city,
        state: this.state,
        zip: this.zip,
        country: this.country
          ? {
            id: this.country,
          }
          : undefined,
        communicationItems,
        types,
        company: this.company
          ? {
            id: this.company,
          }
          : undefined,
        relationship: this.relationship
          ? {
            id: this.relationship,
          }
          : undefined,
        department: this.department
          ? {
            id: this.department,
          }
          : undefined,
        defaultFlag: this.isDefault,
        ...(this.additionalOptions && parseObjectEntries(this.additionalOptions)),
      },
    });
    $.export("$summary", `Successfully created contact with ID: ${response.id}`);
    return response;
  },
};
