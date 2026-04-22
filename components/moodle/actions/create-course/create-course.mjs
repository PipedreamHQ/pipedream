import moodle from "../../moodle.app.mjs";

export default {
  key: "moodle-create-course",
  name: "Create a Course",
  description: "Creates a new course in Moodle. [See the documentation](https://moodledev.io/docs/5.2)",
  version: "0.0.`",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    moodle,
    fullname: {
      type: "string",
      label: "Full Name",
      description: "The full name of the course",
    },
    shortname: {
      type: "string",
      label: "Short Name",
      description: "The short name of the course (used in URLs and navigation)",
    },
    categoryId: {
      propDefinition: [
        moodle,
        "categoryId",
      ],
    },
    summary: {
      type: "string",
      label: "Summary",
      description: "A brief description or summary of the course",
      optional: true,
    },
    format: {
      type: "string",
      label: "Course Format",
      description: "The format of the course (e.g. `weeks`, `topics`, `social`, `site`)",
      optional: true,
    },
    visible: {
      type: "boolean",
      label: "Visible",
      description: "Whether the course is visible to students",
      optional: true,
    },
    idnumber: {
      type: "string",
      label: "ID Number",
      description: "An optional ID number for the course (used for external systems)",
      optional: true,
    },
    startdate: {
      type: "integer",
      label: "Start Date",
      description: "The course start date as a Unix timestamp",
      optional: true,
    },
    enddate: {
      type: "integer",
      label: "End Date",
      description: "The course end date as a Unix timestamp",
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {
      "courses[0][fullname]": this.fullname,
      "courses[0][shortname]": this.shortname,
      "courses[0][categoryid]": this.categoryId,
    };
    if (this.summary !== undefined) params["courses[0][summary]"] = this.summary;
    if (this.format !== undefined) params["courses[0][format]"] = this.format;
    if (this.visible !== undefined) params["courses[0][visible]"] = this.visible
      ? 1
      : 0;
    if (this.idnumber !== undefined) params["courses[0][idnumber]"] = this.idnumber;
    if (this.startdate !== undefined) params["courses[0][startdate]"] = this.startdate;
    if (this.enddate !== undefined) params["courses[0][enddate]"] = this.enddate;

    const response = await this.moodle.createCourses({
      $,
      params,
    });
    $.export("$summary", `Successfully created course "${this.fullname}"`);
    return response;
  },
};
