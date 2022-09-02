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
    email: {
      type: "string",
      label: "Email",
      description: "The student's email address",
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
      studentEmail: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      password: this.password,
    });
    $.export("$summary", `Successfully added student ${this.email} to course`);
    return response;
  },
});
