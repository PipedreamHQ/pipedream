import coassemble from "../../app/coassemble.app";

export default {
  key: "coassemble-send-course-invitation",
  name: "Send Course Invitation",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Enrol existing users into a course. [See the docs here](https://developers.coassemble.com/api/enrolments#create-enrolments)",
  type: "action",
  props: {
    coassemble,
    user: {
      propDefinition: [
        coassemble,
        "studentId",
      ],
    },
    course: {
      propDefinition: [
        coassemble,
        "courseId",
      ],
    },
  },
  async run({ $ }) {
    const {
      coassemble,
      ...data
    } = this;
    const response = await coassemble.createEnrolment({
      $,
      data,
    });

    $.export("$summary", "A new course invitation was successfully created!");
    return response;
  },
};
