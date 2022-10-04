import waitwhile from "../../app/waitwhile.app";
import { defineAction } from "@pipedream/types";

export default defineAction({
  name: "Remove User Invite",
  version: "0.0.1",
  key: "waitwhile-remove-user-invite",
  description: "Remove a user invite",
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
    const data = await this.waitwhile.removeUserInvite(this.inviteId);
    $.export("summary", "Successfully removed user invite");
    return data;
  },
});
