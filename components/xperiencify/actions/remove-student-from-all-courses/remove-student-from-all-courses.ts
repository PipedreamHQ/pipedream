import { defineAction } from "@pipedream/types";
import xperiencify from "../../app/xperiencify.app";

export default defineAction({
  name: "Remove Student from all Courses",
  description: "Remove a student from all courses. [See docs](https://howto.xperiencify.com/article.php?article=123#4)",
  key: "xperiencify-remove-student-from-all-courses",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    xperiencify,
    student: {
      propDefinition: [
        xperiencify,
        "student",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.xperiencify.removeStudentFromAllCourses({
      $,
      data: {
        student_email: this.student,
      },
    });
    $.export("$summary", `Successfully removed student ${this.student} from all courses`);
    return response;
  },
});
