import pixiebrix from "../../pixiebrix.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "pixiebrix-delete-group-membership",
  name: "Delete Group Membership",
  description: "Deletes a single group membership. [See the documentation](https://docs.pixiebrix.com/developer-api/team-management-apis)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    pixiebrix,
    groupId: {
      propDefinition: [
        pixiebrix,
        "groupId",
      ],
    },
    membershipId: {
      propDefinition: [
        pixiebrix,
        "membershipId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.pixiebrix.deleteGroupMembership({
      groupId: this.groupId,
      membershipId: this.membershipId,
    });

    $.export("$summary", `Successfully deleted group membership with ID: ${this.membershipId}`);
    return response;
  },
};
