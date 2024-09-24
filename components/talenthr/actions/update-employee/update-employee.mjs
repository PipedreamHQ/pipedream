import talenthr from "../../talenthr.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "talenthr-update-employee",
  name: "Update Employee",
  description: "Allows updating an existing employee's data in the system. [See the documentation](https://apidocs.talenthr.io/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    talenthr,
    employeeId: {
      propDefinition: [
        talenthr,
        "employeeId",
      ],
    },
    dataFields: {
      propDefinition: [
        talenthr,
        "dataFields",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.talenthr.updateEmployee({
      employeeId: this.employeeId,
      dataFields: this.dataFields,
    });

    $.export("$summary", `Successfully updated employee ID ${this.employeeId}`);
    return response;
  },
};
