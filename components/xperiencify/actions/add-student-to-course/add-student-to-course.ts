import { defineAction } from "@pipedream/types";
import xperiencify from "../../app/xperiencify.app";

export default defineAction({
  name: "Add Student to Course",
  description: "Adds a student to a course. [See docs](https://howto.xperiencify.com/article.php?article=123#1)",
  key: "xperiencify-add-student-to-course",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    xperiencify,
    courseId: {
      propDefinition: [
        xperiencify,
        "courseId",
      ],
    },
    student: {
      // user will input a new email
      type: xperiencify.propDefinitions.student.type,
      label: xperiencify.propDefinitions.student.label,
      description: xperiencify.propDefinitions.student.description,
    },
    firstName: {
      type: "string",
      label: "First Name",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      optional: true,
    },
    password: {
      type: "string",
      label: "Password",
      description: "If left blank, a password will be generated",
      secret: true,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.xperiencify.addStudentToCourse({
      $,
      data: {
        course_id: this.courseId,
        student_email: this.student,
        first_name: this.firstName,
        last_name: this.lastName,
        password: this.password,
      },
    });
    $.export("$summary", `Successfully added student ${this.student} to course`);
    return response;
  },
});
