import moodle from "../../moodle.app.mjs";

export default {
  key: "moodle-get-enrolled-courses-by-timeline",
  name: "Get Enrolled Courses by Timeline Classification",
  description: "Returns a list of courses the current user is enrolled in, filtered by timeline (future, inprogress, or past). [See the documentation](https://moodledev.io/docs/5.2)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    moodle,
    classification: {
      type: "string",
      label: "Classification",
      description: "Filter courses by timeline classification",
      options: [
        "future",
        "inprogress",
        "past",
        "favourite",
        "hidden",
        "allincludinghidden",
        "all",
      ],
    },
    offset: {
      type: "integer",
      label: "Offset",
      description: "The offset of the first course to retrieve",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "The number of courses to return per page",
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {
      classification: this.classification,
    };
    if (this.offset !== undefined) params.offset = this.offset;
    if (this.limit !== undefined) params.limit = this.limit;

    const response = await this.moodle.getEnrolledCoursesByTimeline({
      $,
      params,
    });
    const courses = response?.courses ?? response;
    const count = Array.isArray(courses)
      ? courses.length
      : 0;
    $.export("$summary", `Successfully retrieved ${count} enrolled course(s) with classification "${this.classification}"`);
    return response;
  },
};
