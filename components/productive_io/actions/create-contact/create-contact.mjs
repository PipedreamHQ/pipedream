import productiveIo from "../../productive_io.app.mjs";

export default {
  key: "productiveio-create-contact",
  name: "Create Contact",
  description: "Creates a new contact entry in Productive.io. [See the documentation](https://developer.productive.io/contact_entries.html)",
  version: "0.0.1",
  type: "action",
  props: {
    productiveIo,
    contactDetails: {
      propDefinition: [
        productiveIo,
        "contactDetails",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.productiveIo.createContact({
      $,
      data: {
        type: "contacts",
        attributes: this.contactDetails,
      },
    });

    $.export("$summary", `Successfully created contact with name: ${response.attributes.name}`);
    return response;
  },
};
