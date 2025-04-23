import peerdom from "../../peerdom.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "peerdom-assign-member-to-role",
  name: "Assign Member to Role",
  description: "Assigns a member to a role within a circle using the Peerdom API. [See the documentation](https://api.peerdom.org/v1/docs)",
  version: "0.0.1",
  type: "action",
  props: {
    peerdom,
    roleId: {
      propDefinition: [
        peerdom,
        "roleId",
      ],
    },
    memberId: {
      propDefinition: [
        peerdom,
        "memberId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.peerdom.assignMemberToRole({
      roleId: this.roleId,
      memberId: this.memberId,
    });

    $.export("$summary", `Successfully assigned member with ID ${this.memberId} to role with ID ${this.roleId}`);
    return response;
  },
};
