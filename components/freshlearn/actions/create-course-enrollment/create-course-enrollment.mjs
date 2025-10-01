import freshlearn from "../../freshlearn.app.mjs";

export default {
  key: "freshlearn-create-course-enrollment",
  name: "Create Course Enrollment",
  description: "Enrolls an existing member in a new course. [See the documentation](https://freshlearn.com/support/api)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    freshlearn,
    email: {
      propDefinition: [
        freshlearn,
        "email",
      ],
    },
    courseId: {
      propDefinition: [
        freshlearn,
        "courseId",
      ],
    },
    source: {
      propDefinition: [
        freshlearn,
        "source",
      ],
    },
    planId: {
      type: "string",
      label: "Plan ID",
      description: "You will find this against the course -> pricing",
    },
    transactionId: {
      type: "string",
      label: "Transaction ID",
      description: "Payment unique identifier for the enrollment",
    },
  },
  async run({ $ }) {
    const response = await this.freshlearn.enrollMemberInCourse({
      data: {
        memberEmail: this.email,
        courseId: this.courseId,
        source: this.source,
        planId: this.planId,
        transactionId: this.transactionId,
      },
      $,
    });

    $.export("$summary", `Successfully enrolled member ${this.email} in course ${this.courseId}.`);

    return response;
  },
};
