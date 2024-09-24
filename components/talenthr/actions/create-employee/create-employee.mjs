import talenthr from "../../talenthr.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "talenthr-create-employee",
  name: "Create Employee",
  description: "Hires a new employee and registers them in the system. [See the documentation](https://apidocs.talenthr.io/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    talenthr,
    name: {
      propDefinition: [
        talenthr,
        "name",
      ],
    },
    role: {
      propDefinition: [
        talenthr,
        "role",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.talenthr.createEmployee({
      name: this.name,
      role: this.role,
    });

    $.export("$summary", `Successfully created employee: ${response.name}`);
    return response;
  },
};
