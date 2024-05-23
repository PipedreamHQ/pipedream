import upbooks from "../../upbooks.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "upbooks-add-employee",
  name: "Add New Employee",
  description: "Adds a new employee to Upbooks. The 'employee details' prop is required, which should include information like full name, job position, and contact details.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    upbooks,
    employeeDetails: {
      type: "string",
      label: "Employee Details",
      description: "Details of the new employee in JSON format including full name, job position, and contact details.",
    },
  },
  async run({ $ }) {
    const response = await this.upbooks.addNewEmployee({
      employeeDetails: this.employeeDetails,
    });
    $.export("$summary", "Successfully added a new employee");
    return response;
  },
};
