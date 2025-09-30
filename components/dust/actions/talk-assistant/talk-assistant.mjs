import { TIMEZONE_OPTIONS } from "../../common/constants.mjs";
import dust from "../../dust.app.mjs";

export default {
  key: "dust-talk-assistant",
  name: "Talk to Assistant",
  description: "Send a message to an assistant on Dust and receive an answer. [See the documentation](https://docs.dust.tt/reference/post_api-v1-w-wid-assistant-conversations-cid-messages)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    dust,
    assistantId: {
      propDefinition: [
        dust,
        "assistantId",
      ],
    },
    content: {
      type: "string",
      label: "Message Content",
      description: "The content of the message to be sent to the assistant",
    },
    timezone: {
      type: "string",
      label: "Timezone",
      description: "Set the timezone in which you want to operate.",
      options: TIMEZONE_OPTIONS,
    },
    username: {
      type: "string",
      label: "Username",
      description: "The name to be displayed in the conversation.",
    },
    email: {
      type: "string",
      label: "Email",
      description: "Put an email if needed.",
    },
  },
  async run({ $ }) {
    const {
      conversation, message,
    } = await this.dust.sendMessageToAssistant({
      $,
      data: {
        message: {
          content: this.content,
          context: {
            timezone: this.timezone,
            username: this.username,
            fullName: null,
            email: this.email,
            profilePictureUrl: null,
          },
          mentions: [
            {
              configurationId: this.assistantId,
            },
          ],
        },
        blocking: true,
        visibility: "unlisted",
        title: null,
      },
    });

    $.export("$summary", "Successfully sent message to assistant");
    return {
      agentMessage: conversation.content[1][0].content,
      conversationUrl: `https://dust.tt/w/${conversation.owner.sId}/assistant/${conversation.sId}`,
      message,
    };
  },
};
