import freshlearn from "../../freshlearn.app.mjs";

export default {
  key: "freshlearn-create-course-enrollment",
  name: "Create Course Enrollment",
  description: "Enrolls an existing member in a new course. [See the documentation](https://freshlearn.com/support/api)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    freshlearn,
    memberId: {
      propDefinition: [
        freshlearn,
        "memberId",
      ],
    },
    courseId: {
      propDefinition: [
        freshlearn,
        "courseId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.freshlearn.enrollMemberInCourse({
      memberId: this.memberId,
      courseId: this.courseId,
    });
    $.export("$summary", `Successfully enrolled member ${this.memberId} in course ${this.courseId}`);
    return response;
  },
};
