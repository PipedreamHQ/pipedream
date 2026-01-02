import canvas from "../../canvas.app.mjs";

export default {
  key: "canvas-list-assignments",
  name: "List Assignments",
  description: "Retrieve a list of assignments for a course. [See the documentation](https://mitt.uib.no/doc/api/all_resources.html#method.assignments_api.user_index)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    canvas,
    accountId: {
      propDefinition: [
        canvas,
        "accountId",
      ],
    },
    userId: {
      propDefinition: [
        canvas,
        "userId",
        (c) => ({
          accountId: c.accountId,
        }),
      ],
    },
    courseId: {
      propDefinition: [
        canvas,
        "courseId",
        (c) => ({
          userId: c.userId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const assignments = await this.canvas.listAssignments({
      $,
      userId: this.userId,
      courseId: this.courseId,
    });
    $.export("$summary", `${assignments.length} assignment${assignments.length > 1
      ? "s"
      : ""} were successfully retrieved.`);
    return assignments;
  },
};
