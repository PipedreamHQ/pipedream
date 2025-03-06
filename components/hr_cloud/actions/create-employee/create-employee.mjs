import hrCloud from "../../hr_cloud.app.mjs";

export default {
  key: "hr_cloud-create-employee",
  name: "Create Employee",
  description: "Create a new employee record in the system. [See the documentation](https://help.hrcloud.com/api/#/employee#POST_employee)",
  version: "0.0.1",
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
    employeeNumber: {
      propDefinition: [
        hrCloud,
        "employeeNumber",
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
    recordStatus: {
      propDefinition: [
        hrCloud,
        "recordStatus",
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
        xRecordStatus: this.recordStatus,
        xEmploymentStatusLookup: this.employmentStatus,
        xLocationLookup: this.locationId,
      },
    });

    $.export("$summary", `Successfully created employee: ${this.firstName} ${this.lastName}`);
    return response;
  },
};
