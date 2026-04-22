import moodle from "../../moodle.app.mjs";

export default {
  key: "moodle-import-course",
  name: "Import Course",
  description: "Imports course data from one course into another without user data. [See the documentation](https://moodledev.io/docs/5.2)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    moodle,
    importfrom: {
      propDefinition: [
        moodle,
        "courseId",
      ],
      label: "Import From (Course ID)",
      description: "The ID of the source course to import data from",
    },
    importto: {
      propDefinition: [
        moodle,
        "courseId",
      ],
      label: "Import To (Course ID)",
      description: "The ID of the destination course to import data into",
    },
    deletecontent: {
      type: "boolean",
      label: "Delete Existing Content",
      description: "If `true`, deletes the existing content in the destination course before importing",
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {
      importfrom: this.importfrom,
      importto: this.importto,
    };
    if (this.deletecontent !== undefined) params.deletecontent = this.deletecontent
      ? 1
      : 0;

    const response = await this.moodle.importCourse({
      $,
      params,
    });
    $.export("$summary", `Successfully imported course data from course ${this.importfrom} into course ${this.importto}`);
    return response;
  },
};
