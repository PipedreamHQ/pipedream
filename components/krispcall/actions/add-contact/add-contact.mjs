import krispcall from "../../krispcall.app.mjs";

export default {
  key: "krispcall-add-contact",
  name: "Add Contact",
  description: "Creates a new contact. [See the documentation](https://documenter.getpostman.com/view/32476792/2sA3dxFCaL)",
  version: "0.0.1",
  type: "action",
  props: {
    krispcall,
    number: {
      propDefinition: [
        krispcall,
        "number",
      ],
    },
    name: {
      propDefinition: [
        krispcall,
        "name",
      ],
      optional: true,
    },
    email: {
      propDefinition: [
        krispcall,
        "email",
      ],
      optional: true,
    },
    company: {
      propDefinition: [
        krispcall,
        "company",
      ],
      optional: true,
    },
    address: {
      propDefinition: [
        krispcall,
        "address",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.krispcall.createContact({
      $,
      data: {
        number: this.number,
        name: this.name,
        email: this.email,
        company: this.company,
        address: this.address,
      },
    });
    $.export("$summary", `Successfully created contact with ID ${response.id}`);
    return response;
  },
};
