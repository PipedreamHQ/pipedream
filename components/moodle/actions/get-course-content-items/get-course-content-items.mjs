import moodle from "../../moodle.app.mjs";

export default {
  key: "moodle-get-course-content-items",
  name: "Get Course Content Items",
  description: "Fetches all available content items, including activities, resources, and their subtypes, for the activity picker. [See the documentation](https://moodledev.io/docs/5.2)",
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
    sectionId: {
      propDefinition: [
        moodle,
        "sectionId",
        ({ courseId }) => ({
          courseId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.moodle.getCourseContentItems({
      $,
      params: {
        courseid: this.courseId,
        sectionid: this.sectionId,
      },
    });
    $.export("$summary", `Successfully retrieved content items for section ${this.sectionId}`);
    return response;
  },
};
