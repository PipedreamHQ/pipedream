import summit from "../../summit.app.mjs";

export default {
  key: "summit-create-contact",
  name: "Create Contact",
  description: "Creates a new contact record within Summit",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    summit,
    first_name: {
      propDefinition: [
        summit,
        "first_name",
      ],
    },
    last_name: {
      propDefinition: [
        summit,
        "last_name",
      ],
    },
    email: {
      propDefinition: [
        summit,
        "email",
      ],
    },
    phone_number: {
      propDefinition: [
        summit,
        "phone_number",
      ],
    },
  },
  async run({ $ }) {
    const contactData = {
      first_name: this.first_name,
      last_name: this.last_name,
      email: this.email,
      phone_number: this.phone_number,
    };
    const response = await this.summit.createContact(contactData);
    $.export("$summary", `Successfully created contact: ${this.first_name} ${this.last_name}`);
    return response;
  },
};
