import { ConfigurationError } from "@pipedream/platform";
import vapi from "../../vapi.app.mjs";

export default {
  key: "vapi-create-call",
  name: "Create Call",
  description: "Starts a new conversation with an assistant. [See the documentation](https://docs.vapi.ai/api-reference/calls/create)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    vapi,
    name: {
      type: "string",
      label: "Conversation Name",
      description: "Name of the new conversation",
      optional: true,
    },
    assistantId: {
      propDefinition: [
        vapi,
        "assistantId",
      ],
      optional: true,
    },
    squadId: {
      propDefinition: [
        vapi,
        "squadId",
      ],
      optional: true,
    },
    phoneNumberId: {
      propDefinition: [
        vapi,
        "phoneNumberId",
      ],
    },
    customerId: {
      type: "string",
      label: "Customer ID",
      description: "ID of the customer for the conversation",
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.assistantId && !this.squadId) {
      throw new ConfigurationError("Specify either `Assistant Id` or `Squad Id`");
    }

    const response = await this.vapi.startConversation({
      $,
      data: {
        assistantId: this.assistantId,
        squadId: this.squadId,
        phoneNumberId: this.phoneNumberId,
        name: this.name,
        customerId: this.customerId,
      },
    });
    $.export("$summary", `Conversation created with ID ${response.id}`);
    return response;
  },
};
