import moodle from "../../moodle.app.mjs";

export default {
  key: "moodle-log-course-viewed",
  name: "Log a Course Viewed",
  description: "Logs that a specific course has been viewed by the current user. [See the documentation](https://moodledev.io/docs/5.2)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    moodle,
    courseId: {
      propDefinition: [
        moodle,
        "courseId",
      ],
    },
    sectionId: {
      propDefinition: [
        moodle,
        "sectionId",
        ({ courseId }) => ({
          courseId,
        }),
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.moodle.viewCourse({
      $,
      params: {
        courseid: this.courseId,
        sectionnumber: this.sectionId,
      },
    });
    $.export("$summary", `Successfully logged view for course ${this.courseId}`);
    return response;
  },
};
