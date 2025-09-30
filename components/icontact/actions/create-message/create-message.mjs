import { MESSAGE_TYPE_OPTIONS } from "../../common/constants.mjs";
import { checkWarnings } from "../../common/utils.mjs";
import icontact from "../../icontact.app.mjs";

export default {
  key: "icontact-create-message",
  name: "Create and Dispatch Message",
  description: "Creates and dispatches a new message using custom HTML. [See the documentation](https://help.icontact.com/customers/s/article/Messages-iContact-API?r=153&ui-knowledge-components-aura-actions.KnowledgeArticleVersionCreateDraftFromOnlineAction.createDraftFromOnlineArticle=1)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    icontact,
    campaignId: {
      propDefinition: [
        icontact,
        "campaignId",
      ],
    },
    messageType: {
      type: "string",
      label: "Message Type",
      description: "The kind of message being added.",
      options: MESSAGE_TYPE_OPTIONS,
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "The subject line of the email.",
    },
    htmlBody: {
      type: "string",
      label: "HTML Body",
      description: "Contains the HTML version of the email message body.",
      optional: true,
    },
    textBody: {
      type: "string",
      label: "Text Body",
      description: "Contains the text version of the email message body.",
      optional: true,
    },
    messageName: {
      type: "string",
      label: "Message Name",
      description: "The reference name of the message. This is used for organizational purposes and will not be seen by your contacts.",
      optional: true,
    },
    previewText: {
      type: "string",
      label: "Preview Text",
      description: "Indicates the preview text that some email systems display before opening the email.",
      optional: true,
    },
    replyToCampaignId: {
      propDefinition: [
        icontact,
        "campaignId",
      ],
      label: "Reply To Campaign Id",
      description: "Indicates the sender property where you want reply emails to be sent to.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      icontact,
      ...message
    } = this;

    const response = await icontact.createMessage({
      $,
      data: {
        message,
      },
    });

    checkWarnings(response);

    $.export("$summary", `Successfully created message with ID: ${response.messages[0].messageId}`);
    return response.messages[0];
  },
};
