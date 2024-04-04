import pixiebrix from "../../pixiebrix.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "pixiebrix-update-group-membership",
  name: "Update Group Membership",
  description: "Updates the memberships of a group in PixieBrix. [See the documentation](https://docs.pixiebrix.com/developer-api/team-management-apis)",
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
    members: {
      propDefinition: [
        pixiebrix,
        "members",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.pixiebrix.updateGroupMemberships({
      groupId: this.groupId,
      members: this.members.map(JSON.parse),
    });
    $.export("$summary", `Updated group memberships for group ID ${this.groupId}`);
    return response;
  },
};
