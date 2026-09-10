import { ConfigurationError } from "@pipedream/platform";
import {
  REPLY_TYPE_OPTIONS,
  REPLY_MESSAGE_TYPE_OPTIONS,
  REPLY_ON_BEHALF_OF_OPTIONS,
} from "../../common/constants.mjs";
import intercom from "../../intercom.app.mjs";

export default {
  key: "intercom-reply-to-conversation",
  name: "Reply To Conversation",
  description: "Reply to an existing Intercom conversation as an admin or on behalf of a contact (POST /conversations/{conversation_id}/reply). Use **List Admin ID Options** to find a valid Admin ID, and **Search Contacts** to find a contact's Intercom user ID, email, or external user ID. Example: set **Conversation ID** to `192783634529321`, **Reply Type** to `admin`, **Message Type** to `comment`, **Body** to `Thanks for reaching out!`, and **Admin ID** to `25` to post that comment as an admin reply. [See the documentation](https://developers.intercom.com/docs/references/rest-api/api.intercom.io/conversations/replyconversation).",
  version: "0.1.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  ai: "optimized",
  props: {
    intercom,
    conversationId: {
      propDefinition: [
        intercom,
        "conversationId",
      ],
      description: "The Intercom provisioned identifier for the conversation (e.g. `192783634529321`). Run **List Conversations** first to discover one, or reuse the ID from a prior **Reply To Conversation**, **Manage A Conversation**, or **Retrieve Conversation** call's response. If a specific ID isn't known, set this to the literal string `last` to reply to the most recently updated conversation instead of guessing an ID.",
    },
    replyType: {
      type: "string",
      label: "Reply Type",
      description: "Who the reply is from. Select `user` (Contact Reply) to reply on behalf of a contact, or `admin` (Admin Reply) to reply as an admin.",
      options: REPLY_TYPE_OPTIONS,
    },
    messageType: {
      type: "string",
      label: "Message Type",
      description: "The type of the message. Use `comment` for a standard reply (valid for both admin and contact replies). Use `note` for an internal note (valid only for admin replies). Defaults to `comment`.",
      options: REPLY_MESSAGE_TYPE_OPTIONS,
      optional: true,
      default: "comment",
    },
    body: {
      type: "string",
      label: "Body",
      description: "The text body of the reply.",
    },
    adminId: {
      type: "string",
      label: "Admin ID",
      description: "The ID of the admin sending the reply (required when **Reply Type** is `admin`). Run **List Admin ID Options** first to discover valid admin IDs (e.g. `9876543`).",
      optional: true,
    },
    replyOnBehalfOf: {
      type: "string",
      label: "Reply On Behalf Of",
      description: "When **Reply Type** is `user`, selects which contact identifier field to send. Choose `intercom_user_id`, `email`, or `user_id`, then populate the matching prop below. Run **Search Contacts** first to find a contact's identifiers.",
      options: REPLY_ON_BEHALF_OF_OPTIONS,
      optional: true,
    },
    intercomUserId: {
      type: "string",
      label: "Intercom User ID",
      description: "The Intercom user ID of the contact (used when **Reply On Behalf Of** is `intercom_user_id`). Run **Search Contacts** first to find a contact's `id` (e.g. `6762f1571bb69f9f2193bbbb`).",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email of the contact (used when **Reply On Behalf Of** is `email`). Run **Search Contacts** first to find a contact's email (e.g. `jane.doe@example.com`).",
      optional: true,
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "The external user ID of the contact (used when **Reply On Behalf Of** is `user_id`). Run **Search Contacts** first to find a contact's `external_id`.",
      optional: true,
    },
    attachmentUrls: {
      type: "string[]",
      label: "Attachment URLs",
      description: "A list of image URLs that will be added as attachments. You can include up to 10 URLs.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      conversationId,
      body,
      attachmentUrls,
      replyType,
      adminId,
      replyOnBehalfOf,
      intercomUserId,
      email,
      userId,
      messageType,
    } = this;

    let resolvedAdminId = adminId;
    if (replyType === "admin" && !resolvedAdminId) {
      const me = await this.intercom.getAdmin($);
      resolvedAdminId = me?.id;
    }

    let contactIdentifier = {};
    if (replyType === "user") {
      if (messageType === "note") {
        throw new ConfigurationError("`Message Type` must be `comment` when `Reply Type` is `user` — `note` is only valid for admin replies.");
      }

      const identifiersByField = {
        intercom_user_id: intercomUserId,
        email,
        user_id: userId,
      };

      if (replyOnBehalfOf) {
        const value = identifiersByField[replyOnBehalfOf];
        if (!value) {
          throw new ConfigurationError(`\`Reply On Behalf Of\` is set to \`${replyOnBehalfOf}\`, but the matching identifier prop is empty. Run **Search Contacts** first to find a valid value.`);
        }
        contactIdentifier = {
          [replyOnBehalfOf]: value,
        };
      } else if (!intercomUserId && !email && !userId) {
        throw new ConfigurationError("When **Reply Type** is `user`, you must provide one of **Intercom User ID**, **Email**, or **User ID** to identify the contact the reply is from. Run **Search Contacts** first to find a valid value.");
      } else {
        contactIdentifier = identifiersByField;
      }
    }

    const response = await this.intercom.replyToConversation({
      $,
      conversationId,
      data: {
        body,
        attachment_urls: attachmentUrls,
        admin_id: resolvedAdminId,
        message_type: messageType,
        type: replyType,
        ...contactIdentifier,
      },
    });

    $.export("$summary", `Reply added to conversation ${conversationId}`);
    return response;
  },
};
