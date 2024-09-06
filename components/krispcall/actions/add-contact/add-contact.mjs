import krispcall from "../../krispcall.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "krispcall-add-contact",
  name: "Add Contact",
  description: "Creates a new contact. [See the documentation](https://documenter.getpostman.com/view/32476792/2sa3dxfcal)",
  version: "0.0.{{ts}}",
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
    },
    email: {
      propDefinition: [
        krispcall,
        "email",
      ],
    },
    company: {
      propDefinition: [
        krispcall,
        "company",
      ],
    },
    address: {
      propDefinition: [
        krispcall,
        "address",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.krispcall.createContact({
      number: this.number,
      name: this.name,
      email: this.email,
      company: this.company,
      address: this.address,
    });

    $.export("$summary", `Successfully created contact with number ${this.number}`);
    return response;
  },
};
