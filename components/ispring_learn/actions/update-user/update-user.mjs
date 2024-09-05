import { parseObject } from "../../common/utils.mjs";
import ispringLearn from "../../ispring_learn.app.mjs";

export default {
  key: "ispring_learn-update-user",
  name: "Update User",
  description: "Allows to modify the properties of a specific user on iSpring Learn.",
  version: "0.0.1",
  type: "action",
  props: {
    ispringLearn,
    userId: {
      propDefinition: [
        ispringLearn,
        "userId",
      ],
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email of the user.",
      optional: true,
    },
    login: {
      type: "string",
      label: "Login",
      description: "The login of the user.",
      optional: true,
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the user.",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the user.",
      optional: true,
    },
    jobTitle: {
      type: "string",
      label: "Job Title",
      description: "The job title of the user.",
      optional: true,
    },
    departmentId: {
      propDefinition: [
        ispringLearn,
        "departmentId",
      ],
      optional: true,
    },
    groupIds: {
      propDefinition: [
        ispringLearn,
        "groupId",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.ispringLearn.updateUser({
      $,
      userId: this.userId,
      data: {
        fields: {
          email: this.email,
          login: this.login,
          first_name: this.firstName,
          last_name: this.lastName,
          job_title: this.jobTitle,
        },
        departmentId: this.departmentId,
        groupIds: parseObject(this.groupIds),
      },
    });

    $.export("$summary", `Successfully updated user with ID ${this.userId}`);
    return response;
  },
};
