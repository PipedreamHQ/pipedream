import educateme from "../../educateme.app.mjs";

export default {
  key: "educateme-get-course-activities",
  name: "Get Course Activities",
  description: "Get the activities for a course. [See the documentation](https://edme.notion.site/API-integration-v0-2-ef33641eb7f24fa9a6efb969c1f2928f)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    educateme,
    courseId: {
      propDefinition: [
        educateme,
        "courseId",
      ],
    },
  },
  async run({ $ }) {
    const { result } = await this.educateme.listCourseActivities({
      $,
      courseId: this.courseId,
    });
    $.export("$summary", "Successfully retrieved course activities");
    return result;
  },
};
