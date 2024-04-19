import softr from "../../softr.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "softr-delete-user",
  name: "Delete User",
  description: "Removes an existing user from a specified Softr app. Be aware, this action is irreversible.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    softr,
    appName: {
      propDefinition: [
        softr,
        "appName",
      ],
    },
    userId: {
      propDefinition: [
        softr,
        "userId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.softr.removeUser({
      appName: this.appName,
      userId: this.userId,
    });

    $.export("$summary", `Successfully deleted user with ID: ${this.userId}`);
    return response;
  },
};
