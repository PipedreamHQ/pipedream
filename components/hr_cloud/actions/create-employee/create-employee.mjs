import hrCloud from "../../hr_cloud.app.mjs";

export default {
  key: "hr_cloud-create-employee",
  name: "Create Employee",
  description: "Create a new employee record in the system. [See the documentation](https://help.hrcloud.com/api/#/employee#POST_employee)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    hrCloud,
    firstName: {
      propDefinition: [
        hrCloud,
        "firstName",
      ],
    },
    lastName: {
      propDefinition: [
        hrCloud,
        "lastName",
      ],
    },
    email: {
      propDefinition: [
        hrCloud,
        "email",
      ],
    },
    jobTitle: {
      propDefinition: [
        hrCloud,
        "jobTitle",
      ],
    },
    departmentId: {
      propDefinition: [
        hrCloud,
        "departmentId",
      ],
    },
    startDate: {
      propDefinition: [
        hrCloud,
        "startDate",
      ],
    },
    locationId: {
      propDefinition: [
        hrCloud,
        "locationId",
      ],
    },
    employmentStatus: {
      propDefinition: [
        hrCloud,
        "employmentStatusId",
      ],
    },
    employeeNumber: {
      propDefinition: [
        hrCloud,
        "employeeNumber",
      ],
    },
    recordStatus: {
      propDefinition: [
        hrCloud,
        "recordStatus",
      ],
    },
    address: {
      propDefinition: [
        hrCloud,
        "address",
      ],
    },
    city: {
      propDefinition: [
        hrCloud,
        "city",
      ],
    },
    state: {
      propDefinition: [
        hrCloud,
        "state",
      ],
    },
    zip: {
      propDefinition: [
        hrCloud,
        "zip",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.hrCloud.createEmployee({
      $,
      data: {
        xFirstName: this.firstName,
        xLastName: this.lastName,
        xEmail: this.email,
        xFullName: `${this.firstName} ${this.lastName}`,
        xPositionLookup: this.jobTitle,
        xDepartmentLookup: this.departmentId,
        xStartDate: this.startDate,
        xLocationLookup: this.locationId,
        xEmploymentStatusLookup: this.employmentStatus,
        xEmployeeNumber: this.employeeNumber,
        xRecordStatus: this.recordStatus,
        xAddress1: this.address,
        xCity: this.city,
        xState: this.state,
        xZipCode: this.zip,
      },
    });

    $.export("$summary", `Successfully created employee: ${this.firstName} ${this.lastName}`);
    return response;
  },
};
