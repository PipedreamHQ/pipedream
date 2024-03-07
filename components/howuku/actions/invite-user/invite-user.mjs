import howuku from "../../howuku.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "howuku-invite-user",
  name: "Invite User",
  description: "Invites a new user to join a team on Howuku. If no team ID is provided, the default team will be used.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    howuku,
    userEmail: {
      propDefinition: [
        howuku,
        "userEmail",
      ],
    },
    teamId: {
      propDefinition: [
        howuku,
        "teamId",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.howuku.inviteUser(this.userEmail, this.teamId || "default");
    $.export("$summary", `Successfully invited user ${this.userEmail} to join the team`);
    return response;
  },
};
