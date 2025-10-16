import { defineAction } from "@pipedream/types";
import xperiencify from "../../app/xperiencify.app";

export default defineAction({
  name: "Remove Student from Course",
  description: "Remove a student from a course. [See docs](https://howto.xperiencify.com/article.php?article=123#3)",
  key: "xperiencify-remove-student-from-course",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
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
      propDefinition: [
        xperiencify,
        "student",
        (c) => ({
          courseId: c.courseId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.xperiencify.removeStudentFromCourse({
      $,
      data: {
        course_id: this.courseId,
        student_email: this.student,
      },
    });
    $.export("$summary", `Successfully removed student ${this.student} from course`);
    return response;
  },
});
