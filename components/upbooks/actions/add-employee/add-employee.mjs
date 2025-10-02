import upbooks from "../../upbooks.app.mjs";

export default {
  key: "upbooks-add-employee",
  name: "Add New Employee",
  description: "Adds a new employee to Upbooks. [See the documentation](https://www.postman.com/scrrum/workspace/upbooks-io/request/13284127-a51a907a-0648-477d-96f6-f5a9e79262fd)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    upbooks,
    name: {
      type: "string",
      label: "Name",
      description: "Full name of the employee.",
    },
    employeeNumber: {
      type: "string",
      label: "Employee Number",
      description: "The identification number of the employee.",
      optional: true,
    },
    type: {
      type: "string",
      label: "Type",
      description: "The employee's type.",
      options: [
        "full-time",
        "part-time",
      ],
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "The employee's email.",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "The employee's phone.",
      optional: true,
    },
    dob: {
      type: "string",
      label: "DOB",
      description: "The employee's date of birth. Format: YYYY-MM-DD",
      optional: true,
    },
    dateOfJoining: {
      type: "string",
      label: "Date Of Joining",
      description: "The employee's start date. Format: YYYY-MM-DDTHH:MM:SSZ",
      optional: true,
    },
    dateOfLeaving: {
      type: "string",
      label: "Date Of Leaving",
      description: "The employee's end date. Format: YYYY-MM-DDTHH:MM:SSZ",
      optional: true,
    },
    ctc: {
      type: "integer",
      label: "CTC",
      description: "Cost to company in cents.",
    },
    salaryComponentId: {
      propDefinition: [
        upbooks,
        "salaryComponentId",
      ],
    },
    designation: {
      type: "string",
      label: "Designation",
      description: "In which position the employee will work.",
      optional: true,
    },
    role: {
      type: "string",
      label: "Role",
      description: "The identification of the employee's role.",
      options: [
        "staff",
        "admin",
        "others",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.upbooks.addNewEmployee({
      $,
      data: {
        name: this.name,
        employeeNumber: this.employeeNumber,
        type: this.type,
        email: this.email,
        phone: this.phone,
        dob: this.dob,
        employment: [
          {
            dateOfJoining: this.dateOfJoining,
            dateOfLeaving: this.dateOfLeaving,
            salary: {
              ctc: (this.ctc / 100).toFixed(2),
              componentGroup: {
                id: this.salaryComponentId,
              },
            },
            designation: this.designation,
            role: this.role,
          },
        ],
      },
    });
    $.export("$summary", `Successfully added a new employee with Id: ${response.data._id}`);
    return response;
  },
};
