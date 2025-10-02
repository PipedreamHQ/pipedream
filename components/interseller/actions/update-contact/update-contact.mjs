import interseller from "../../interseller.app.mjs";

export default {
  key: "interseller-update-contact",
  name: "Update Contact",
  description: "Update an existing contact. [See the documentation](https://interseller.readme.io/reference/update-contact)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    interseller,
    contactId: {
      propDefinition: [
        interseller,
        "contactId",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the contact.",
      optional: true,
    },
    company: {
      type: "string",
      label: "Company",
      description: "The company of the contact.",
      optional: true,
    },
    profileUrl: {
      type: "string",
      label: "Profile URL",
      description: "The profile URL of the contact.",
      optional: true,
    },
    sourceUrl: {
      type: "string",
      label: "Source URL",
      description: "The source URL of the contact.",
      optional: true,
    },
    location: {
      type: "string",
      label: "Location",
      description: "The location of the contact.",
      optional: true,
    },
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "The phone number of the contact.",
      optional: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title of the contact.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.interseller.updateContact({
      $,
      contactId: this.contactId,
      data: {
        name: this.name,
        company: this.company,
        profile_url: this.profileUrl,
        source_url: this.sourceUrl,
        location: this.location,
        phone_number: this.phoneNumber,
        title: this.title,
      },
    });
    $.export("$summary", `Successfully updated the contact with ID ${this.contactId}`);
    return response;
  },
};
