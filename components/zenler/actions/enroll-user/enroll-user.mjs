import zenler from "../../zenler.app.mjs";

export default {
  key: "zenler-enroll-user",
  name: "Enroll User",
  description: "Enrolls a user to a course. [See the docs here](https://www.newzenler.com/api/documentation/public/api-doc.html#faaadc39-5702-bb2c-640f-c76a47c26f81)",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    zenler,
    userId: {
      propDefinition: [
        zenler,
        "userId",
      ],
    },
    courseId: {
      propDefinition: [
        zenler,
        "courseId",
      ],
    },
  },
  async run({ $ }) {
    const {
      userId,
      courseId,
    } = this;

    const response = await this.zenler.enrollUser({
      userId,
      data: {
        course_id: courseId,
      },
    });

    if (typeof(response) === "string") {
      console.log(response);
      throw new Error("Response error");
    }

    const { data } = response;

    $.export("$summary", data);

    return response;
  },
};
