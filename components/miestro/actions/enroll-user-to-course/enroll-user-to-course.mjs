import app from "../../miestro.app.mjs";

export default {
  key: "miestro-enroll-user-to-course",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  name: "Enroll User To Course",
  description: "Enrolls user to a course. [See the documentation](https://support.miestro.com/article/279-api-documentation)",
  props: {
    app,
    userId: {
      propDefinition: [
        app,
        "userId",
      ],
    },
    courseId: {
      propDefinition: [
        app,
        "courseId",
      ],
    },
  },
  async run ({ $ }) {
    const resp = await this.app.enrollUserToCourse({
      $,
      userId: this.userId,
      data: {
        course_id: this.courseId,
      },
    });
    $.export("$summary", `User(ID:${this.userId}) has been enrolled to the course(ID:${this.courseId}) successfully.`);
    return resp;
  },
};
