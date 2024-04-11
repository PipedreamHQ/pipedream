import thinkific from "../../thinkific.app.mjs";

export default {
  key: "thinkific-enroll-user",
  name: "Enroll User",
  description: "Enroll a user in a course or bundle. A user is either created or found on the Thinkific site for enrollment. [See the documentation](https://developers.thinkific.com/api/api-documentation/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    thinkific,
    userId: {
      propDefinition: [
        thinkific,
        "userId",
      ],
      optional: true,
    },
    userEmail: {
      propDefinition: [
        thinkific,
        "userEmail",
      ],
      optional: true,
    },
    courseBundleIds: {
      propDefinition: [
        thinkific,
        "courseBundleIds",
      ],
    },
    userInfo: {
      propDefinition: [
        thinkific,
        "userInfo",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    if (this.userId) {
      // Update user if userInfo is provided
      if (this.userInfo) {
        await this.thinkific.updateUser(this.userId, this.userInfo);
      }
    } else if (this.userEmail) {
      // Create user if userInfo is provided
      if (this.userInfo) {
        await this.thinkific.createUser(this.userInfo);
      }
    } else {
      throw new Error("User ID or User Email must be provided.");
    }
    // Enroll user to courses or bundles
    await this.thinkific.enrollUser(this.userId, this.userEmail, this.courseBundleIds);
    $.export("$summary", `Successfully enrolled user ${this.userId || this.userEmail} to courses/bundles ${this.courseBundleIds.join(", ")}`);
  },
};
