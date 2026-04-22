import moodle from "../../moodle.app.mjs";

export default {
  key: "moodle-enroll-user-in-course",
  name: "Enroll a User in a Course",
  description: "Manually enrolls a user into a specified course with a given role and optional start and end dates. [See the documentation](https://moodledev.io/docs/5.2)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    moodle,
    userId: {
      propDefinition: [
        moodle,
        "userId",
      ],
    },
    courseId: {
      propDefinition: [
        moodle,
        "courseId",
      ],
    },
    roleid: {
      type: "integer",
      label: "Role ID",
      description: "The ID of the role to assign to the user in the course (e.g. `5` for student)",
    },
    timestart: {
      type: "integer",
      label: "Start Date",
      description: "The enrollment start date as a Unix timestamp",
      optional: true,
    },
    timeend: {
      type: "integer",
      label: "End Date",
      description: "The enrollment end date as a Unix timestamp",
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {
      "enrolments[0][roleid]": this.roleid,
      "enrolments[0][userid]": this.userId,
      "enrolments[0][courseid]": this.courseId,
    };
    if (this.timestart !== undefined) params["enrolments[0][timestart]"] = this.timestart;
    if (this.timeend !== undefined) params["enrolments[0][timeend]"] = this.timeend;

    const response = await this.moodle.enrollUsers({
      $,
      params,
    });
    $.export("$summary", `Successfully enrolled user ${this.userId} in course ${this.courseId}`);
    return response;
  },
};
