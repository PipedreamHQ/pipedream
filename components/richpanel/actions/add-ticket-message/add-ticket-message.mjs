import richpanel from "../../richpanel.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "richpanel-add-ticket-message",
  name: "Add Ticket Message",
  description: "Adds a message to an existing ticket. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    richpanel,
    addMessageId: {
      propDefinition: [
        richpanel,
        "addMessageId",
      ],
    },
    addMessageBody: {
      propDefinition: [
        richpanel,
        "addMessageBody",
      ],
    },
    addMessageSenderType: {
      propDefinition: [
        richpanel,
        "addMessageSenderType",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.richpanel.addMessageToTicket();
    $.export("$summary", `Added message to ticket ${this.addMessageId} successfully`);
    return response;
  },
};
