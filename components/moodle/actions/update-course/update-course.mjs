import moodle from "../../moodle.app.mjs";

export default {
  key: "moodle-update-course",
  name: "Update a Course",
  description: "Updates an existing course in Moodle, including name, summary, and visibility. [See the documentation](https://moodledev.io/docs/5.2)",
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
    },
    fullname: {
      type: "string",
      label: "Full Name",
      description: "The updated full name of the course",
      optional: true,
    },
    shortname: {
      type: "string",
      label: "Short Name",
      description: "The updated short name of the course",
      optional: true,
    },
    summary: {
      type: "string",
      label: "Summary",
      description: "The updated summary or description for the course",
      optional: true,
    },
    visible: {
      type: "boolean",
      label: "Visible",
      description: "Whether the course should be visible to students",
      optional: true,
    },
    categoryId: {
      propDefinition: [
        moodle,
        "categoryId",
      ],
      description: "Move the course to a different category",
      optional: true,
    },
    startdate: {
      type: "integer",
      label: "Start Date",
      description: "The updated course start date as a Unix timestamp",
      optional: true,
    },
    enddate: {
      type: "integer",
      label: "End Date",
      description: "The updated course end date as a Unix timestamp",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.moodle.updateCourses({
      $,
      params: {
        "courses[0][id]": this.courseId,
        "courses[0][fullname]": this.fullname,
        "courses[0][shortname]": this.shortname,
        "courses[0][summary]": this.summary,
        "courses[0][visible]": this.visible
          ? 1
          : 0,
        "courses[0][categoryid]": this.categoryId,
        "courses[0][startdate]": this.startdate,
        "courses[0][enddate]": this.enddate,
      },
    });
    $.export("$summary", `Successfully updated course ${this.courseId}`);
    return response;
  },
};
