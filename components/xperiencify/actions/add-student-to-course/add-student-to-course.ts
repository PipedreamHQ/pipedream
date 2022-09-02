import { defineAction } from "@pipedream/types";
import xperiencify from "../../app/xperiencify.app";

export default defineAction({
  name: "Add Student to Course",
  description: "Adds a student to a course. [See docs](https://howto.xperiencify.com/article.php?article=123#1)",
  key: "xperiencify-add-student-to-course",
  version: "0.0.1",
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
      propDefinition: [
        xperiencify,
        "student",
      ],
      options: undefined, // user will input a new email
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
      courseId: this.courseId,
      studentEmail: this.student,
      firstName: this.firstName,
      lastName: this.lastName,
      password: this.password,
    });
    $.export("$summary", `Successfully added student ${this.student} to course`);
    return response;
  },
});
