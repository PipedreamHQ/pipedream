import echtpost_postcards from "../../echtpost_postcards.app.mjs";

export default {
  key: "echtpost_postcards-create-contact",
  name: "Create Contact",
  description: "Creates a new contact within the EchtPost app. [See the documentation](https://hilfe.echtpost.de/article/20/postkartenversand-uber-api-programmierschnittstelle)",
  version: "0.0.1",
  type: "action",
  props: {
    echtpost_postcards,
    name: {
      type: "string",
      label: "Contact Name",
      description: "The name of the new contact.",
    },
    address: {
      type: "string",
      label: "Contact Address",
      description: "The address of the new contact.",
    },
    email: {
      type: "string",
      label: "Contact Email",
      description: "The email of the new contact.",
      optional: true,
    },
    phoneNumber: {
      type: "string",
      label: "Contact Phone Number",
      description: "The phone number of the new contact.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.echtpost_postcards.createContact({
      name: this.name,
      address: this.address,
      email: this.email,
      phone_number: this.phoneNumber, // Ensure the key matches the API parameter
    });

    $.export("$summary", `Successfully created contact: ${this.name}`);
    return response;
  },
};
