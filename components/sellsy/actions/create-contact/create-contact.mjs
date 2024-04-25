import sellsy from "../../sellsy.app.mjs";

export default {
  key: "sellsy-create-contact",
  name: "Create Contact",
  description: "Creates a new contact in Sellsy. [See the documentation](https://api.sellsy.com/doc/v2/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    sellsy,
    firstName: sellsy.propDefinitions.firstName,
    lastName: sellsy.propDefinitions.lastName,
    email: sellsy.propDefinitions.email,
    companyName: {
      ...sellsy.propDefinitions.companyName,
      optional: true,
    },
  },
  async run({ $ }) {
    const contactData = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      companyName: this.companyName,
    };

    const response = await this.sellsy.createContact(contactData);

    $.export("$summary", `Successfully created contact ${this.firstName} ${this.lastName}`);

    return response;
  },
};
