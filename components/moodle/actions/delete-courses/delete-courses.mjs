import moodle from "../../moodle.app.mjs";

export default {
  key: "moodle-delete-courses",
  name: "Delete Courses",
  description: "Deletes one or more existing Moodle courses by ID. [See the documentation](https://moodledev.io/docs/5.2)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    moodle,
    courseIds: {
      type: "string[]",
      label: "Course IDs",
      description: "The IDs of the courses to delete",
      propDefinition: [
        moodle,
        "courseId",
      ],
    },
  },
  async run({ $ }) {
    const params = {};
    this.courseIds.forEach((id, i) => {
      params[`courseids[${i}]`] = id;
    });

    const response = await this.moodle.deleteCourses({
      $,
      params,
    });
    $.export("$summary", `Successfully deleted ${this.courseIds.length} course(s)`);
    return response;
  },
};
