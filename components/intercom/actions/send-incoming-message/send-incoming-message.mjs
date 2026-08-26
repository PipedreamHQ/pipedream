// x-pd-ai: optimized
import intercom from "../../intercom.app.mjs";

export default {
  key: "intercom-send-incoming-message",
  name: "Send Incoming Message",
  description: "Creates a new inbound conversation in Intercom on behalf of a contact (POST /conversations). The action first fetches the contact's role via **GET /contacts/{id}** to set the correct message sender type — this counts as an additional API call. Use **Search Contacts** to find valid contact IDs before calling this action. Example: set **User** to `63a07ddf05a32042dffac965` and **Body** to `Hi, I need help with my order` to open a new conversation from that contact. Returns the new conversation object including `id`. [See the documentation](https://developers.intercom.com/intercom-api-reference/reference/create-a-conversation)",
  version: "0.0.8",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    intercom,
    userId: {
      propDefinition: [
        intercom,
        "userIds",
      ],
      type: "string",
      label: "User",
      description: "The user initiating the conversation",
    },
    body: {
      propDefinition: [
        intercom,
        "body",
      ],
      description: "The content of the message",
    },
  },
  async run({ $ }) {
    const {
      userId,
      body,
    } = this;
    const { role } = await this.intercom.getContact(userId, $);
    const data = {
      from: {
        type: role,
        id: userId,
      },
      body,
    };
    const res = await this.intercom.createConversation(data, $);
    $.export("$summary", `Message sent successfully with ID ${res.id}`);
    return res;
  },
};
