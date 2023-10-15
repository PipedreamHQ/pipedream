import productlane from "../../productlane.app.mjs";

export default {
  key: "productlane-create-contact",
  name: "Create Contact",
  description: "Creates a new contact with email, name, and an array of segments in Productlane. [See the documentation](https://docs.productlane.com/api-reference/contacts/create-contact)",
  version: "0.0.1",
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
      propDefinition: [
        productlane,
        "name",
      ],
    },
    segments: {
      propDefinition: [
        productlane,
        "segments",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.productlane.createContact({
      data: {
        email: this.email,
        name: this.name,
        segments: this.segments,
      },
    });
    $.export("$summary", `Successfully created contact ${this.name} with email ${this.email}`);
    return response;
  },
};
