import edusign from "../../edusign.app.mjs";

export default {
  key: "edusign-add-student-to-course",
  name: "Add Student to Course",
  description: "Add a student to a course. [See the documentation](https://developers.edusign.com/reference/putv1courseattendancecourseid)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    edusign,
    courseId: {
      propDefinition: [
        edusign,
        "courseId",
      ],
    },
    studentId: {
      propDefinition: [
        edusign,
        "studentId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.edusign.addStudentToCourse({
      $,
      courseId: this.courseId,
      data: {
        studentId: this.studentId,
      },
    });
    $.export("$summary", `Successfully added student ${this.studentId} to course ${this.courseId}`);
    return response;
  },
};
