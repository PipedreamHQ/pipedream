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
      description: "The course field to search by. Use `id` for one course ID, `ids` for comma-separated course IDs like `12,34,56`, `shortname` for a course short name like `BIO101`, `idnumber` for an external course ID number, `category` for a category ID like `7`, or `sectionid` for a Moodle course section ID.",
      options: [
        "id",
        "ids",
        "shortname",
        "idnumber",
        "category",
        "sectionid",
      ],
    },
    value: {
      type: "string",
      label: "Value",
      description: "The value to match against the selected field. Examples: `42` for `id`, `42,43` for `ids`, `BIO101` for `shortname`, or `7` for `category`.",
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
      : courses && typeof courses === "object"
        ? Object.keys(courses).length
        : 0;
    $.export("$summary", `Successfully retrieved ${count} course(s) by ${this.field}`);
    return response;
  },
};
