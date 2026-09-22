import moodle from "../../moodle.app.mjs";

export default {
  key: "moodle-get-course-content",
  name: "Get Course Content",
  description: "Retrieves the sections and modules (activities/resources) inside a course. [See the documentation](https://moodledev.io/docs/5.2)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    moodle,
    courseId: {
      propDefinition: [
        moodle,
        "courseId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.moodle.getCourseContents({
      $,
      params: {
        courseid: this.courseId,
      },
    });
    $.export("$summary", `Successfully retrieved content for course ${this.courseId}`);
    return response;
  },
};
