import ispringLearn from "../../ispring_learn.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "ispring_learn-enroll-users-in-courses",
  name: "Enroll Users in Courses",
  description: "Enrolls users to the specified courses on iSpring Learn.",
  version: "0.0.1",
  type: "action",
  props: {
    ispringLearn,
    userIds: {
      propDefinition: [
        ispringLearn,
        "userIds",
      ],
    },
    courseIds: {
      propDefinition: [
        ispringLearn,
        "courseIds",
      ],
    },
    enrollmentDate: {
      propDefinition: [
        ispringLearn,
        "enrollmentDate",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.ispringLearn.enrollUser({
      userIds: this.userIds,
      courseIds: this.courseIds,
      enrollmentDate: this.enrollmentDate,
    });

    $.export("$summary", "Successfully enrolled users in courses");
    return response;
  },
};
