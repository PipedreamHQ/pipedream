import pixiebrix from "../../pixiebrix.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "pixiebrix-list-group-memberships",
  name: "List Group Memberships",
  description: "Gets the current memberships of a group. [See the PixieBrix API documentation](https://docs.pixiebrix.com/developer-api/team-management-apis)",
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
  },
  async run({ $ }) {
    const response = await this.pixiebrix.listGroupMemberships({
      groupId: this.groupId,
    });
    $.export("$summary", `Successfully listed group memberships for group ID ${this.groupId}`);
    return response;
  },
};
