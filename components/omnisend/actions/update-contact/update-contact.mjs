import omnisend from "../../omnisend.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "omnisend-update-contact",
  name: "Update Contact",
  description: "Modify subscriber information or update their subscription status. [See the documentation](https://api-docs.omnisend.com/reference/patch_contacts-contactid)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    omnisend,
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "The unique identifier of the contact to update.",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the contact.",
      optional: true,
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the contact.",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the contact.",
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Tags are labels you create to organize and manage your audience.",
      optional: true,
    },
    status: {
      type: "string",
      label: "Subscription Status",
      description: "Email channel status. Available statuses: subscribed, unsubscribed, nonSubscribed.",
      options: [
        "subscribed",
        "unsubscribed",
        "nonSubscribed",
      ],
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "The country of the contact.",
      optional: true,
    },
    countryCode: {
      type: "string",
      label: "Country Code",
      description: "The ISO country code (2 characters).",
      optional: true,
    },
    state: {
      type: "string",
      label: "State",
      description: "The state of the contact.",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "The city of the contact.",
      optional: true,
    },
    address: {
      type: "string",
      label: "Address",
      description: "The street address of the contact.",
      optional: true,
    },
    postalCode: {
      type: "string",
      label: "Postal Code",
      description: "The postal or zip code of the contact.",
      optional: true,
    },
    gender: {
      type: "string",
      label: "Gender",
      description: "The gender of the contact ('m' for male, 'f' for female).",
      options: [
        "m",
        "f",
      ],
      optional: true,
    },
    birthdate: {
      type: "string",
      label: "Birthdate",
      description: "The birthdate of the contact in YYYY-MM-DD format.",
      optional: true,
    },
    customProperties: {
      type: "object",
      label: "Custom Properties",
      description: "Custom properties for the contact.",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      ...(this.email && {
        identifiers: [
          {
            id: this.email,
            type: "email",
          },
        ],
      }),
      ...(this.firstName && {
        firstName: this.firstName,
      }),
      ...(this.lastName && {
        lastName: this.lastName,
      }),
      ...(this.tags && {
        tags: this.tags,
      }),
      ...(this.status && {
        status: this.status,
      }),
      ...(this.country && {
        country: this.country,
      }),
      ...(this.countryCode && {
        countryCode: this.countryCode,
      }),
      ...(this.state && {
        state: this.state,
      }),
      ...(this.city && {
        city: this.city,
      }),
      ...(this.address && {
        address: this.address,
      }),
      ...(this.postalCode && {
        postalCode: this.postalCode,
      }),
      ...(this.gender && {
        gender: this.gender,
      }),
      ...(this.birthdate && {
        birthdate: this.birthdate,
      }),
      ...(this.customProperties && {
        customProperties: this.customProperties,
      }),
    };

    const response = await this.omnisend.updateContact({
      contactId: this.contactId,
      data,
    });

    $.export("$summary", `Successfully updated contact with ID ${this.contactId}`);
    return response;
  },
};
