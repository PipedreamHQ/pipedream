import moodle from "../../moodle.app.mjs";

export default {
  key: "moodle-get-enrolled-users",
  name: "Get Enrolled Users",
  description: "Retrieves a list of users enrolled in a specific course, including their roles and groups. [See the documentation](https://moodledev.io/docs/5.2)",
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
  },
  async run({ $ }) {
    const response = await this.moodle.getEnrolledUsers({
      $,
      params: {
        courseid: this.courseId,
      },
    });
    $.export("$summary", `Successfully retrieved ${response.length} enrolled user(s) for course ${this.courseId}`);
    return response;
  },
};
