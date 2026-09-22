import canvas from "../../canvas.app.mjs";

export default {
  key: "canvas-list-courses",
  name: "List Courses",
  description: "List all the courses associated with a given user. [See the documentation](https://mitt.uib.no/doc/api/all_resources.html#method.courses.user_index)",
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
  },
  async run({ $ }) {
    const courses = await this.canvas.listCourses({
      $,
      userId: this.userId,
    });
    $.export("$summary", `${courses.length} course${courses.length > 1
      ? "s"
      : ""} were successfully retrieved.`);
    return courses;
  },
};
