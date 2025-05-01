import kiwihr from "../../kiwihr.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "kiwihr-update-employee-record",
  name: "Update Employee Record",
  description: "Update an existing employee's record in kiwiHR. [See the documentation](https://api.kiwihr.it/api/docs/mutation.doc.html)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    kiwihr,
    employeeId: {
      propDefinition: [
        kiwihr,
        "employeeId",
      ],
    },
    jobTitle: {
      propDefinition: [
        kiwihr,
        "jobTitle",
      ],
      optional: true,
    },
    department: {
      propDefinition: [
        kiwihr,
        "department",
      ],
      optional: true,
    },
    supervisor: {
      propDefinition: [
        kiwihr,
        "supervisor",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      ...(this.jobTitle && {
        positionId: this.jobTitle,
      }),
      ...(this.department && {
        teamId: this.department,
      }),
      ...(this.supervisor && {
        managerId: this.supervisor,
      }),
    };

    const response = await this.kiwihr.updateEmployee({
      employeeId: this.employeeId,
      ...data,
    });

    $.export("$summary", `Successfully updated employee record for ID: ${this.employeeId}`);
    return response;
  },
};
