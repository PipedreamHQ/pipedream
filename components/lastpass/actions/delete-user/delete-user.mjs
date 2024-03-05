import lastpass from "../../lastpass.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "lastpass-delete-user",
  name: "Delete User",
  description: "Deactivates or completely removes a user account. This action must be used responsibly, considering its irreversible nature.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    lastpass,
    userId: {
      propDefinition: [
        lastpass,
        "userId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.lastpass.deactivateOrDeleteUser(this.userId);
    $.export("$summary", `Successfully deactivated or deleted user with ID: ${this.userId}`);
    return response;
  },
};
