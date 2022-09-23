import waitwhile from "../../app/waitwhile.app";
import { defineAction } from "@pipedream/types";

export default defineAction({
  name: "Retrieve User Invite",
  version: "0.0.1",
  key: "waitwhile-retrieve-user-invite",
  description: "Retrieve a user invite",
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
    const data = await this.waitwhile.retrieveUserInvite(this.inviteId);
    $.export("summary", "Successfully retrieved user invite");
    return data;
  },
});
