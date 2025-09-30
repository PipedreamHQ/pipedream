import omnisend from "../../omnisend.app.mjs";

export default {
  key: "omnisend-update-contact",
  name: "Update Contact",
  description: "Modify subscriber information or update their subscription status. [See the documentation](https://api-docs.omnisend.com/reference/patch_contacts-contactid)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    omnisend,
    contactId: {
      propDefinition: [
        omnisend,
        "contactId",
      ],
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
    const {
      omnisend,
      contactId,
      ...data
    } = this;

    const response = await omnisend.updateContact({
      $,
      contactId,
      data,
    });

    $.export("$summary", `Successfully updated contact with ID ${contactId}`);
    return response;
  },
};
