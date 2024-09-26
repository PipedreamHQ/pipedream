import thinkific from "../../thinkific.app.mjs";

export default {
  key: "thinkific-enroll-user",
  name: "Enroll User",
  description: "Creates a new Enrollment for specified student in specified course. [See the documentation](https://developers.thinkific.com/api/api-documentation/#/Enrollments/createEnrollment)",
  version: "0.0.2",
  type: "action",
  props: {
    thinkific,
    userId: {
      propDefinition: [
        thinkific,
        "userId",
      ],
    },
    courseId: {
      propDefinition: [
        thinkific,
        "courseId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.thinkific.enrollUser({
      $,
      data: {
        user_id: this.userId,
        course_id: this.courseId,
      },
    });
    $.export("$summary", `Successfully enrolled user ${this.userId} in course ${this.courseId}`);
    return response;
  },
};
