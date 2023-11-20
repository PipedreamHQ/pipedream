js;
import freshlearn from "../../freshlearn.app.mjs";

export default {
  key: "freshlearn-update-member",
  name: "Update Member",
  description: "Updates the details of an existing member. [See the documentation](https://freshlearn.com/support/api)",
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
    memberDetails: {
      propDefinition: [
        freshlearn,
        "memberDetails",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.freshlearn.updateMember({
      memberId: this.memberId,
      memberDetails: this.memberDetails,
    });
    $.export("$summary", `Successfully updated member with ID ${this.memberId}`);
    return response;
  },
};
