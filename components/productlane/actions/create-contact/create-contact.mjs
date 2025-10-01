import productlane from "../../productlane.app.mjs";

export default {
  key: "productlane-create-contact",
  name: "Create Contact",
  description: "Creates a new contact with email, name, and an array of segments in Productlane. [See the documentation](https://productlane.com/docs/api-reference/contacts/create-contact)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    productlane,
    email: {
      propDefinition: [
        productlane,
        "email",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the contact",
      optional: true,
    },
    segments: {
      type: "string[]",
      label: "Segments",
      description: "Array of segments",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.productlane.createContact({
      $,
      data: {
        email: this.email,
        name: this.name,
        segments: this.segments,
      },
    });
    $.export("$summary", `Successfully created contact ${this.email}`);
    return response;
  },
};
