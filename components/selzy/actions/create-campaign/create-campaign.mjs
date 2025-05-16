import selzy from "../../selzy.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "selzy-create-email-campaign",
  name: "Create Email Campaign",
  description: "Creates a new email campaign. [See the documentation](https://selzy.com/en/support/api/messages/createcampaign/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    selzy,
    subject: {
      propDefinition: [
        selzy,
        "subject",
      ],
    },
    senderName: {
      propDefinition: [
        selzy,
        "senderName",
      ],
    },
    senderEmail: {
      propDefinition: [
        selzy,
        "senderEmail",
      ],
    },
    messageContent: {
      propDefinition: [
        selzy,
        "messageContent",
      ],
    },
    listId: {
      propDefinition: [
        selzy,
        "listId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.selzy.createCampaign({
      subject: this.subject,
      sender_name: this.senderName,
      sender_email: this.senderEmail,
      message_content: this.messageContent,
      list_id: this.listId,
    });

    $.export("$summary", `Successfully created email campaign with ID: ${response.campaign_id}`);
    return response;
  },
};
