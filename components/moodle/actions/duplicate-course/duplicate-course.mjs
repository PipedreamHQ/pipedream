import moodle from "../../moodle.app.mjs";

export default {
  key: "moodle-duplicate-course",
  name: "Duplicate a Course",
  description: "Duplicates an existing course, creating a new course with optional settings. [See the documentation](https://moodledev.io/docs/5.2)",
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
      description: "The ID of the course to duplicate",
    },
    fullname: {
      type: "string",
      label: "Full Name",
      description: "The full name for the duplicated course",
    },
    shortname: {
      type: "string",
      label: "Short Name",
      description: "The short name for the duplicated course",
    },
    categoryId: {
      propDefinition: [
        moodle,
        "categoryId",
      ],
      description: "The category in which to place the duplicated course",
    },
    visible: {
      type: "boolean",
      label: "Visible",
      description: "Whether the duplicated course should be visible to students",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.moodle.duplicateCourse({
      $,
      params: {
        courseid: this.courseId,
        fullname: this.fullname,
        shortname: this.shortname,
        categoryid: this.categoryId,
        visible: this.visible === undefined
          ? undefined
          : this.visible
            ? 1
            : 0,
      },
    });
    $.export("$summary", `Successfully duplicated course "${this.fullname}"`);
    return response;
  },
};
