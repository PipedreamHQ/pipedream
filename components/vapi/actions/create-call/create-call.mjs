import vapi from "../../vapi.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "vapi-create-call",
  name: "Create Call",
  description: "Starts a new conversation with an assistant. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    vapi,
    assistantId: {
      propDefinition: [
        vapi,
        "assistantId",
      ],
    },
    squadId: {
      propDefinition: [
        vapi,
        "squadId",
      ],
    },
    phoneNumberId: {
      propDefinition: [
        vapi,
        "phoneNumberId",
      ],
    },
    name: {
      type: "string",
      label: "Conversation Name",
      description: "Name of the new conversation (optional)",
      optional: true,
    },
    customerId: {
      type: "string",
      label: "Customer ID",
      description: "ID of the customer for the conversation (optional)",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.vapi.startConversation();
    $.export("$summary", `Conversation created with ID ${response.id}`);
    return response;
  },
};
