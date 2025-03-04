import hrCloud from "../../hr_cloud.app.mjs";

export default {
  key: "hr_cloud-create-employee",
  name: "Create Employee",
  description: "Create a new employee record in the system. [See the documentation](https://help.hrcloud.com/api/#/introduction#top)",
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
  },
  async run({ $ }) {
    const response = await this.hrCloud.createEmployee({
      $,
      data: {
        first_name: this.firstName,
        last_name: this.lastName,
        email: this.email,
        job_title_id: this.jobTitle,
        department_id: this.departmentId,
        start_date: this.startDate,
      },
    });

    $.export("$summary", `Successfully created employee: ${this.firstName} ${this.lastName}`);
    return response;
  },
};
