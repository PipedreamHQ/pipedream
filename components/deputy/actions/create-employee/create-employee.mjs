import deputy from "../../deputy.app.mjs";

export default {
  key: "deputy-create-employee",
  name: "Create Employee",
  description: "Adds a new employee or staff member to the organization in Deputy.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    deputy,
    personalDetails: {
      propDefinition: [
        deputy,
        "personalDetails",
      ],
    },
    designation: {
      propDefinition: [
        deputy,
        "designation",
      ],
    },
    employmentType: {
      propDefinition: [
        deputy,
        "employmentType",
      ],
    },
    contactDetails: {
      propDefinition: [
        deputy,
        "contactDetails",
      ],
      optional: true,
    },
    emergencyContacts: {
      propDefinition: [
        deputy,
        "emergencyContacts",
      ],
      optional: true,
    },
    employeeNotes: {
      propDefinition: [
        deputy,
        "employeeNotes",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const employeeDetails = {
      personalDetails: this.personalDetails,
      designation: this.designation,
      employmentType: this.employmentType,
      contactDetails: this.contactDetails,
      emergencyContacts: this.emergencyContacts,
      employeeNotes: this.employeeNotes,
    };

    const response = await this.deputy.addNewEmployee({
      data: employeeDetails,
    });
    $.export("$summary", `Successfully created employee with ID: ${response.Id}`);
    return response;
  },
};
