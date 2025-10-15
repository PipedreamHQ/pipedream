import thoughtly from "../../thoughtly.app.mjs";

export default {
  key: "thoughtly-create-contact",
  name: "Create Contact",
  description: "Generates a new contact within your Thoughtly team. [See the documentation](https://api.thought.ly/docs/#/contact/post_contact_create)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    thoughtly,
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "The phone number of the new contact.",
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the new contact.",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email of the new contact.",
      optional: true,
    },
    countryCode: {
      type: "string",
      label: "Country Code",
      description: "The country code of the new contact's phone number.",
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Tags associated with the new contact.",
      optional: true,
    },
    attributes: {
      type: "object",
      label: "Attributes",
      description: "Additional attributes for the new contact.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.thoughtly.createContact({
      $,
      data: {
        phone_number: this.phoneNumber,
        name: this.name,
        email: this.email,
        country_code: this.countryCode,
        tags: this.tags,
        attributes: this.attributes,
      },
    });
    $.export("$summary", `Successfully created contact with ID: ${response.data.id}`);
    return response;
  },
};
