import moodle from "../../moodle.app.mjs";

export default {
  key: "moodle-get-course-update",
  name: "Get a Course Update",
  description: "Checks if there are any updates affecting the current user in a specified Moodle course since a given timestamp. [See the documentation](https://moodledev.io/docs/5.2)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    moodle,
    courseId: {
      propDefinition: [
        moodle,
        "courseId",
      ],
    },
    since: {
      type: "integer",
      label: "Since",
      description: "Return updates since this Unix timestamp",
    },
  },
  async run({ $ }) {
    const response = await this.moodle.getCourseUpdates({
      $,
      params: {
        courseid: this.courseId,
        since: this.since,
      },
    });
    $.export("$summary", `Successfully retrieved updates for course ${this.courseId}`);
    return response;
  },
};
