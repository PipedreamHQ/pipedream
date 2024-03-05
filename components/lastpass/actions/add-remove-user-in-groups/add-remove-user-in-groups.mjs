import lastpass from "../../lastpass.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "lastpass-add-remove-user-in-groups",
  name: "Add or Remove User in Groups",
  description: "Manages user group membership in LastPass. Either adds a user to a group or removes them from a group.",
  version: "0.0.1",
  type: "action",
  props: {
    lastpass,
    userId: {
      propDefinition: [
        lastpass,
        "userId",
      ],
    },
    groupIds: {
      propDefinition: [
        lastpass,
        "groupIds",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.lastpass.manageUserGroup({
      userId: this.userId,
      groupIds: this.groupIds,
    });
    $.export("$summary", `User ${this.userId} group membership updated.`);
    return response;
  },
};
