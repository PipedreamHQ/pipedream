import personio from "../../personio.app.mjs";

export default {
  key: "personio-create-employee",
  name: "Create Employee",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Creates a new employee. [See the documentation](https://developer.personio.de/reference/post_company-employees)",
  type: "action",
  props: {
    personio,
    email: {
      propDefinition: [
        personio,
        "email",
      ],
    },
    firstName: {
      propDefinition: [
        personio,
        "firstName",
      ],
    },
    lastName: {
      propDefinition: [
        personio,
        "lastName",
      ],
    },
    gender: {
      type: "string",
      label: "Gender",
      description: "The gender of the employee.",
      optional: true,
    },
    position: {
      type: "string",
      label: "Position",
      description: "The position of the employee. E.g. **developer**.",
      optional: true,
    },
    subcompany: {
      type: "string",
      label: "Subcompany",
      description: "The subcompany employee belongs to. Should be predefined in Personio. Otherwise will be ignored with showing meta error in the response.",
      optional: true,
    },
    department: {
      type: "string",
      label: "Department",
      description: "The department employee belongs to. Should be predefined in Personio. Otherwise will be ignored with showing meta error in the response.",
      optional: true,
    },
    office: {
      type: "string",
      label: "Office",
      description: "The office employee belongs to. Should be predefined in Personio. Otherwise will be ignored with showing meta error in the response.",
      optional: true,
    },
    hireDate: {
      type: "string",
      label: "Hire Date",
      description: "Employee hire date. Format: \"yyyy-mm-dd\". If `status` is not provided, it will be set to `active` if the hire date is in the past, or to `onboarding` if it's in the future.",
      optional: true,
    },
    weeklyWorkingHours: {
      type: "integer",
      label: "Weekly Working Hours",
      description: "All hours usually worked, including regular overtime.",
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "Status of the employee. Overrides the status determined based on the value of `hire_date`.",
      options: [
        "onboarding",
        "active",
        "leave",
        "inactive",
      ],
      optional: true,
    },
    supervisorId: {
      propDefinition: [
        personio,
        "supervisorId",
      ],
      optional: true,
    },
    customAttributes: {
      type: "object",
      label: "Custom Attributes",
      description: "Additional attributes to the employee.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      personio,
      firstName,
      lastName,
      hireDate,
      weeklyWorkingHours,
      supervisorId,
      customAttributes,
      ...data
    } = this;

    const response = await personio.createEmployee({
      $,
      data: {
        employee: {
          first_name: firstName,
          last_name: lastName,
          hire_date: hireDate,
          weekly_working_hours: weeklyWorkingHours,
          supervisor_id: supervisorId,
          custom_attributes: customAttributes,
          ...data,
        },
      },
    });

    $.export("$summary", `A new employee with Id: ${response.data?.id} was successfully created!`);
    return response;
  },
};
