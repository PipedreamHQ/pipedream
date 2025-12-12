import edusign from "../../edusign.app.mjs";

export default {
  key: "edusign-create-student",
  name: "Create Student",
  description: "Create a new student. [See the documentation](https://developers.edusign.com/reference/postv1student)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    edusign,
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the student",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the student",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email of the student",
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "The phone number of the student",
      optional: true,
    },
    photo: {
      type: "string",
      label: "Photo",
      description: "The URL of the student's photo",
      optional: true,
    },
    fileNumber: {
      type: "string",
      label: "File Number",
      description: "The file number of the student",
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "The tags of the student",
      optional: true,
    },
    groupIds: {
      propDefinition: [
        edusign,
        "groupId",
      ],
      type: "string[]",
      label: "Groups",
      description: "The groups of the student",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.edusign.createStudent({
      $,
      data: {
        student: {
          FIRSTNAME: this.firstName,
          LASTNAME: this.lastName,
          EMAIL: this.email,
          PHONE: this.phone,
          PHOTO: this.photo,
          FILE_NUMBER: this.fileNumber,
          TAGS: this.tags,
          GROUPS: this.groupIds,
        },
      },
    });
    $.export("$summary", `Successfully created student with ID: ${response.result.ID}`);
    return response;
  },
};
