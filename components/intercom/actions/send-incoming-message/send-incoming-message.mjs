import intercom from "../../intercom.app.mjs";

export default {
  key: "intercom-send-incoming-message",
  name: "Send Incoming Message",
  description: "Send a message from a user into your Intercom app. [See the docs here](https://developers.intercom.com/intercom-api-reference/reference/create-a-conversation)",
  version: "0.0.6",
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
