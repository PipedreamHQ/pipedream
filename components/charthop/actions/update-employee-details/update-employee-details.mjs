import charthop from "../../charthop.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "charthop-update-employee-details",
  name: "Update Employee Details",
  description: "Updates an existing employee's profile, including department, role, or compensation. [See the documentation](https://docs.charthop.com)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    charthop,
    updateEmployeeId: {
      propDefinition: [
        charthop,
        "updateEmployeeId",
      ],
    },
    updateFields: {
      propDefinition: [
        charthop,
        "updateFields",
      ],
    },
    updateMetadata: {
      propDefinition: [
        charthop,
        "updateMetadata",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.charthop.updateEmployeeProfile();
    $.export("$summary", `Successfully updated employee with ID ${this.updateEmployeeId}`);
    return response;
  },
};
