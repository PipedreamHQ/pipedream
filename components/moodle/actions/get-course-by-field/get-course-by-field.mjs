import moodle from "../../moodle.app.mjs";

export default {
  key: "moodle-get-course-by-field",
  name: "Get a Course by Field",
  description: "Retrieves courses that match a specific field such as ID, short name, ID number, category, or section ID. [See the documentation](https://moodledev.io/docs/5.2)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    moodle,
    field: {
      type: "string",
      label: "Field",
      description: "The field to search by",
      options: [
        "id",
        "ids",
        "shortname",
        "idnumber",
        "category",
        "section",
      ],
    },
    value: {
      type: "string",
      label: "Value",
      description: "The value to match against the selected field",
    },
  },
  async run({ $ }) {
    const response = await this.moodle.getCoursesByField({
      $,
      params: {
        field: this.field,
        value: this.value,
      },
    });
    const courses = response?.courses ?? response;
    const count = Array.isArray(courses)
      ? courses.length
      : 1;
    $.export("$summary", `Successfully retrieved ${count} course(s) by ${this.field}`);
    return response;
  },
};
