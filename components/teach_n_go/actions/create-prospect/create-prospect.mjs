import app from "../../teach_n_go.app.mjs";

export default {
  key: "teach_n_go-create-prospect",
  name: "Create Prospect",
  description: "Creates a new prospect inside Teach 'n Go. [See the documentation](https://intercom.help/teach-n-go/en/articles/5750592-prospect-registration-api)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    firstName: {
      propDefinition: [
        app,
        "firstName",
      ],
    },
    lastName: {
      propDefinition: [
        app,
        "lastName",
      ],
    },
    mobilePhone: {
      type: "integer",
      label: "Mobile Phone",
      description: "The prospect's contact number.",
      optional: true,
    },
    emailAddress: {
      propDefinition: [
        app,
        "emailAddress",
      ],
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "General information you wish to capture.",
      optional: true,
    },
    gender: {
      propDefinition: [
        app,
        "gender",
      ],
      optional: true,
    },
    dateOfBirth: {
      propDefinition: [
        app,
        "dateOfBirth",
      ],
      optional: true,
    },
    courseSubject: {
      type: "string",
      label: "Course Subject",
      description: "The students chosen subject.",
      optional: true,
    },
    courseLevel: {
      type: "string",
      label: "Course Level",
      description: "The students chosen level.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.createProspect({
      $,
      data: {
        "fname": this.firstName,
        "lname": this.lastName,
        "mobile_phone": this.mobilePhone,
        "email_address": this.emailAddress,
        "description": this.description,
        "gender": this.gender,
        "date_of_birth": this.dateOfBirth,
        "course_subject": this.courseSubject,
        "course_level": this.courseLevel,
      },
    });
    $.export("$summary", `Successfully created prospect with ID: ${response.data.id}`);
    return response;
  },
};
