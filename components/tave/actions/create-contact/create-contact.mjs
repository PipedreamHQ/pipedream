import tave from "../../tave.app.mjs";

export default {
  key: "tave-create-contact",
  name: "Create Contact",
  description: "Creates a new contact in the Tave system. [See the documentation](https://tave.io/v2)",
  version: "0.0.1",
  type: "action",
  props: {
    tave,
    contact: {
      propDefinition: [
        tave,
        "contact",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.tave.createContact(this.contact);
    $.export("$summary", `Successfully created contact with name: ${response.name}`);
    return response;
  },
};
