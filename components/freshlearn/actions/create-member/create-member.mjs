import freshlearn from "../../freshlearn.app.mjs";

export default {
  key: "freshlearn-create-member",
  name: "Create Member",
  description: "Creates a new member within FreshLearn. [See the documentation](https://freshlearn.com/support/api)",
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
    productBundleId: {
      propDefinition: [
        freshlearn,
        "productBundleId",
      ],
    },
    memberDetails: {
      propDefinition: [
        freshlearn,
        "memberDetails",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.freshlearn.createMember({
      memberId: this.memberId,
      courseId: this.courseId,
      productBundleId: this.productBundleId,
      memberDetails: this.memberDetails,
    });
    $.export("$summary", "Successfully created new member");
    return response;
  },
};
