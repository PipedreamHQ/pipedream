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
    try {
      const data = await this.waitwhile.resendUserInvite(this.inviteId);
      $.export("summary", "Successfully resent user invite");
      return data;
    }catch(error){
      const statusCode = error[Object.getOwnPropertySymbols(error)[1]].status;
      const statusText = error[Object.getOwnPropertySymbols(error)[1]].statusText;
      throw new Error(`Error status code: ${statusCode}. Error status response: ${statusText}. You need a Paid Plan to use this API `);
    }
    
  },
});
