import app from "../../miestro.app.mjs";

export default {
  key: "miestro-unroll-user-to-course",
  version: "0.0.1",
  type: "action",
  name: "Unroll User To Course",
  description: "Unrolls user to a course. [See the documentation](https://support.miestro.com/article/279-api-documentation)",
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
    const resp = await this.app.unrollUserToCourse({
      $,
      userId: this.userId,
      data: {
        course_id: this.courseId,
      },
    });
    $.export("$summary", `User(ID:${this.userId}) has been unrolled to the course(ID:${this.courseId}) successfully.`);
    return resp;
  },
};
