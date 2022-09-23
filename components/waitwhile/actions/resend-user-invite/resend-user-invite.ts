import waitwhile from "../../app/waitwhile.app";
import { defineAction } from "@pipedream/types";

export default defineAction({
  name: "Resend User Invite",
  version: "0.0.1",
  key: "waitwhile-resend-user-invite",
  description: "Resend a user invite",
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
    const data = await this.waitwhile.resendUserInvite(this.inviteId);
    $.export("summary", "Successfully resent user invite");
    return data;
  },
});
