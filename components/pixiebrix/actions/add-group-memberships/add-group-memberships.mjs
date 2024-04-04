import pixiebrix from "../../pixiebrix.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "pixiebrix-add-group-memberships",
  name: "Add Group Memberships",
  description: "Adds a user to a group in PixieBrix. [See the documentation](https://docs.pixiebrix.com/developer-api/team-management-apis)",
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
    userId: {
      propDefinition: [
        pixiebrix,
        "userId",
      ],
    },
  },
  async run({ $ }) {
    const members = JSON.stringify([
      this.userId,
    ]); // Ensuring the members prop is an array of JSON strings as per the app file
    const response = await this.pixiebrix.addGroupMemberships({
      groupId: this.groupId,
      members: [
        members,
      ],
    });

    $.export("$summary", `Successfully added user ID ${this.userId} to group ID ${this.groupId}`);
    return response;
  },
};
