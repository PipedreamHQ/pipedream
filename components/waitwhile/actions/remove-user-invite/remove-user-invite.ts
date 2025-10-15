import waitwhile from "../../app/waitwhile.app";
import { defineAction } from "@pipedream/types";

export default defineAction({
  name: "Remove User Invite",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "waitwhile-remove-user-invite",
  description: "Remove a user invite. [See the doc here](https://developers.waitwhile.com/reference/deleteinvitesinviteid)",
  props: {
    waitwhile,
    inviteId: {
      propDefinition: [
        waitwhile,
        "inviteId",
      ],
    },
  },
  type: "action",
  methods: {},
  async run({ $ }) {
    try {
      const data = await this.waitwhile.removeUserInvite(this.inviteId);
      $.export("summary", "Successfully removed user invite");
      return data;
    } catch (error) {
      const statusCode = error[Object.getOwnPropertySymbols(error)[1]].status;
      const statusText = error[Object.getOwnPropertySymbols(error)[1]].statusText;
      throw new Error(`Error status code: ${statusCode}. Error status response: ${statusText}. You need a Paid Plan to use this API `);
    }
  },
});
