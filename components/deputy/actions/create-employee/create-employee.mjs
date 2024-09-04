import deputy from "../../deputy.app.mjs";

export default {
  key: "deputy-create-employee",
  name: "Create Employee",
  description: "Adds a new employee or staff member to the organization in Deputy. [See the documentation](https://developer.deputy.com/deputy-docs/reference/addanemployee)",
  version: "0.0.1",
  type: "action",
  props: {
    deputy,
    firstName: {
      type: "string",
      label: "First Name",
      description: "First name of the employee",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Last name of the employee",
    },
    locationId: {
      propDefinition: [
        deputy,
        "locationId",
      ],
    },
    dob: {
      type: "string",
      label: "Date of Birth",
      description: "The date of birth of the employee. Example: `1971-01-01`",
      optional: true,
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "The date that the employee started employment. Example: `1971-01-01`",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Phone number of the employee",
      optional: true,
    },
    rate: {
      type: "string",
      label: "Rate",
      description: "The hourly rate of the employee",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.deputy.createEmployee({
      $,
      data: {
        strFirstName: this.firstName,
        strLastName: this.lastName,
        intCompanyId: this.locationId,
        strDob: this.dob,
        strStartDate: this.startDate,
        strMobilePhone: this.phone,
        fltWeekDayRate: this.rate,
      },
    });
    $.export("$summary", `Successfully created employee with ID: ${response.Id}`);
    return response;
  },
};
