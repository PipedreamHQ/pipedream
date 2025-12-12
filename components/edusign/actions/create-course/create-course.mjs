import edusign from "../../edusign.app.mjs";

export default {
  key: "edusign-create-course",
  name: "Create Course",
  description: "Create a new course. [See the documentation](https://developers.edusign.com/reference/postv1course)",
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
      description: "The name of the course",
    },
    start: {
      type: "string",
      label: "Start",
      description: "Start date of the course (ISO 8601 datetime, e.g. `2023-02-15T09:00:00Z`)",
    },
    end: {
      type: "string",
      label: "End",
      description: "End date of the course (ISO 8601 datetime, e.g. `2025-11-29T15:00:00Z`)",
    },
    professorId: {
      propDefinition: [
        edusign,
        "professorId",
      ],
    },
    needStudentSignature: {
      type: "boolean",
      label: "Need Student Signature",
      description: "Whether the course needs a student signature",
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the course",
      optional: true,
    },
    groupIds: {
      propDefinition: [
        edusign,
        "groupId",
      ],
      type: "string[]",
      label: "Group IDs",
      description: "The IDs of the groups to add to the course",
      optional: true,
    },
    maxStudents: {
      type: "integer",
      label: "Max Students",
      description: "The maximum number of students to add to the course",
      optional: true,
    },
    classroomId: {
      propDefinition: [
        edusign,
        "classroomId",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.edusign.createCourse({
      $,
      data: {
        course: {
          NAME: this.name,
          START: this.start,
          END: this.end,
          PROFESSOR: this.professorId,
          NEED_STUDENT_SIGNATURE: this.needStudentSignature,
          DESCRIPTION: this.description,
          SCHOOL_GROUP: this.groupIds,
          MAX_STUDENTS: this.maxStudents,
          CLASSROOM: this.classroomId,
        },
      },
    });
    $.export("$summary", `Successfully created course with ID: ${response.result.ID}`);
    return response;
  },
};
