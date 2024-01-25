import agiled from "../../agiled.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "agiled-create-employee",
  name: "Create Employee",
  description: "Creates a new employee in Agiled. [See the documentation](https://my.agiled.app/developers)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    agiled,
    name: {
      propDefinition: [
        agiled,
        "name",
      ],
    },
    email: {
      propDefinition: [
        agiled,
        "email",
      ],
    },
    designation: {
      propDefinition: [
        agiled,
        "designation",
      ],
    },
    address: {
      propDefinition: [
        agiled,
        "address",
        (c) => ({
          optional: true,
        }),
      ],
    },
    phoneNumber: {
      propDefinition: [
        agiled,
        "phoneNumber",
        (c) => ({
          optional: true,
        }),
      ],
    },
    department: {
      propDefinition: [
        agiled,
        "department",
        (c) => ({
          optional: true,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.agiled.createEmployee({
      name: this.name,
      email: this.email,
      designation: this.designation,
      address: this.address,
      phone_number: this.phoneNumber,
      department: this.department,
    });

    $.export("$summary", `Successfully created employee ${this.name}`);
    return response;
  },
};
