import educateme from "../../educateme.app.mjs";

export default {
  key: "educateme-find-courses",
  name: "Find Courses",
  description: "Find courses by optional filters. [See the documentation](https://edme.notion.site/API-integration-v0-2-ef33641eb7f24fa9a6efb969c1f2928f)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    educateme,
    learnerEmail: {
      type: "string",
      label: "Learner Email",
      description: "Filter courses by assigned learner email",
      optional: true,
    },
    isFinished: {
      type: "boolean",
      label: "Is Finished",
      description: "If the course is finished",
      optional: true,
    },
    isSuspended: {
      type: "boolean",
      label: "Is Suspended",
      description: "If the course is suspended",
      optional: true,
    },
  },
  async run({ $ }) {
    const courses = await this.educateme.listCourses({
      $,
      params: {
        learnerEmail: this.learnerEmail,
        isFinished: this.isFinished,
        isSuspended: this.isSuspended,
      },
    });
    $.export("$summary", `Successfully found ${courses.length} course${courses.length === 1
      ? ""
      : "s"}`);
    return courses;
  },
};
