import edusign from "../../edusign.app.mjs";

export default {
  key: "edusign-create-group",
  name: "Create Group",
  description: "Create a new group. [See the documentation](https://developers.edusign.com/reference/postv1group)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    edusign,
    name: {
      type: "string",
      label: "Name",
      description: "The name of the group",
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the group",
    },
    studentIds: {
      propDefinition: [
        edusign,
        "studentId",
      ],
      type: "string[]",
      label: "Student IDs",
      description: "The IDs of the students to add to the group",
    },
  },
  async run({ $ }) {
    const response = await this.edusign.createGroup({
      $,
      data: {
        group: {
          NAME: this.name,
          DESCRIPTION: this.description,
          STUDENTS: this.studentIds,
        },
      },
    });
    $.export("$summary", `Successfully created group with ID: ${response.result.ID}`);
    return response;
  },
};
