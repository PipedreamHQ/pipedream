import zenler from "../../zenler.app.mjs";

export default {
  key: "zenler-unenroll-user",
  name: "Unenroll User",
  description: "Unenrolls a user from a course. [See the docs here](https://www.newzenler.com/api/documentation/public/api-doc.html#faaadc39-5702-bb2c-640f-c76a47c26f82)",
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

    const response = await this.zenler.unenrollUser({
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
