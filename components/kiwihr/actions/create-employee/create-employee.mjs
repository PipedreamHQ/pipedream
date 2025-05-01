import kiwihr from "../../kiwihr.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "kiwihr-create-employee",
  name: "Create Employee",
  description: "Add a new employee to kiwiHR. [See the documentation](https://api.kiwihr.com/api/docs/mutation.doc.html)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    kiwihr,
    employeeName: {
      type: "string",
      label: "Employee Name",
      description: "Name of the employee to add.",
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email of the employee to add.",
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "Start date of the employee to add. Format: YYYY-MM-DD",
    },
    department: {
      propDefinition: [
        kiwihr,
        "department",
      ],
      optional: true,
    },
    jobTitle: {
      type: "string",
      label: "Job Title",
      description: "Job title of the employee. Optional.",
      optional: true,
    },
    location: {
      propDefinition: [
        kiwihr,
        "location",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      employeeName: this.employeeName,
      email: this.email,
      startDate: this.startDate,
      department: this.department,
      jobTitle: this.jobTitle,
      location: this.location,
    };

    const response = await this.kiwihr.createEmployee(data);

    $.export("$summary", `Successfully created employee ${this.employeeName}`);
    return response;
  },
};
