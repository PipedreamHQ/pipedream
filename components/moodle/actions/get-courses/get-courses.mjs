import moodle from "../../moodle.app.mjs";

export default {
  key: "moodle-get-courses",
  name: "Get Courses",
  description: "Returns course details. If no IDs are provided, returns all courses except the front page. [See the documentation](https://moodledev.io/docs/5.2)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    moodle,
    courseIds: {
      type: "string[]",
      label: "Course IDs",
      description: "The IDs of the courses to retrieve. Leave empty to return all courses",
      propDefinition: [
        moodle,
        "courseId",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {};
    (this.courseIds ?? []).forEach((id, i) => {
      params[`options[ids][${i}]`] = id;
    });

    const response = await this.moodle.getCourses({
      $,
      params,
    });
    $.export("$summary", `Successfully retrieved ${response.length} course(s)`);
    return response;
  },
};
