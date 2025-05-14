import { TIMEZONE_OPTIONS } from "../../common/constants.mjs";
import dust from "../../dust.app.mjs";

export default {
  key: "dust-run-agent",
  name: "Run an Agent",
  description:
    "Send a message to an agent on Dust and receive an answer. [See the documentation](https://docs.dust.tt/reference/post_api-v1-w-wid-assistant-conversations-cid-messages)",
  version: "0.0.2",
  type: "action",
  props: {
    dust,
    agentId: {
      propDefinition: [dust, "agentId"],
    },
    content: {
      type: "string",
      label: "Message Content",
      description: "The content of the message to be sent to the agent",
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
    skipToolsValidation: {
      type: "boolean",
      label: "Skip Tools Validation",
      default: false,
      description:
        "Skip all tools validation. All tools will be run by the agent without user validation.",
    },
  },
  async run({ $ }) {
    const { conversation, message } = await this.dust.sendMessageToAgent({
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
              configurationId: this.agentId,
            },
          ],
        },
        blocking: true,
        skipToolsValidation: this.skipToolsValidation,
        visibility: "unlisted",
        title: null,
      },
    });

    $.export("$summary", "Successfully sent message to agent");
    return {
      agentMessage: conversation.content[1][0].content,
      conversationUrl: `https://dust.tt/w/${conversation.owner.sId}/assistant/${conversation.sId}`,
      message,
    };
  },
};
