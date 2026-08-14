import { ConfigurationError } from "@pipedream/platform";
import app from "../../ez_texting.app.mjs";
import { MESSAGE_TYPES } from "../../common/constants.mjs";

export default {
  key: "ez_texting-send-text-message",
  name: "Send Text Message",
  description: "Send an SMS or MMS message to one or more phone numbers, contact groups, or both. Set **Send At** to schedule the message instead of sending it immediately. [See the documentation](https://developers.eztexting.com/reference/create_3-1)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    message: {
      type: "string",
      label: "Message",
      description: "The text message to send. Optional only when **Message Template ID** is set, which supplies the text instead.",
      optional: true,
    },
    toNumbers: {
      propDefinition: [
        app,
        "phoneNumbers",
      ],
      label: "To Numbers",
      description: "Phone numbers to send to, e.g. `5551234567`. Either **To Numbers** or **Group IDs** must be set.",
      optional: true,
    },
    groupIds: {
      propDefinition: [
        app,
        "groupIds",
      ],
      description: "IDs of the contact groups to send to — the `content[].id` values returned by [`GET /v1/contact-groups`](https://developers.eztexting.com/reference/list_2-1), selectable from the list. Either **To Numbers** or **Group IDs** must be set.",
    },
    fromNumber: {
      propDefinition: [
        app,
        "fromNumber",
      ],
    },
    messageType: {
      type: "string",
      label: "Message Type",
      description: "The type of message to send. `MMS` requires **Media URL** or **Media File ID**.",
      options: MESSAGE_TYPES,
      default: "SMS",
      optional: true,
    },
    mediaUrl: {
      type: "string",
      label: "Media URL",
      description: "URL of the media to attach. Most standard image, video and audio formats are supported, up to 5MB.",
      optional: true,
    },
    mediaFileId: {
      propDefinition: [
        app,
        "mediaFileId",
      ],
    },
    messageTemplateId: {
      propDefinition: [
        app,
        "messageTemplateId",
      ],
    },
    companyName: {
      type: "string",
      label: "Company Name",
      description: "If provided, it is added as a prefix to the message.",
      optional: true,
    },
    sendAt: {
      type: "string",
      label: "Send At",
      description: "An ISO 8601 timestamp for when to send the message, e.g. `2026-12-03T10:15:30+00:00`. Omit to send immediately.",
      optional: true,
    },
    strictValidation: {
      type: "boolean",
      label: "Strict Validation",
      description: "When `false` (the API's default, kept here), the message is delivered to every valid number and invalid ones are skipped without an error — so a mistyped number silently drops that recipient. When `true`, a single invalid number rejects the whole batch, which is safer for a hand-entered list but will fail an entire send over one bad entry.",
      default: false,
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app: ezTexting,
      message,
      toNumbers,
      groupIds,
      fromNumber,
      messageType,
      mediaUrl,
      mediaFileId,
      messageTemplateId,
      companyName,
      sendAt,
      strictValidation,
    } = this;

    if (!toNumbers?.length && !groupIds?.length) {
      throw new ConfigurationError("Set at least one of **To Numbers** or **Group IDs**.");
    }

    if (!message && !messageTemplateId) {
      throw new ConfigurationError("Set either **Message** or **Message Template ID**.");
    }

    if (messageType === "MMS" && !mediaUrl && !mediaFileId) {
      throw new ConfigurationError("Sending an MMS requires **Media URL** or **Media File ID**.");
    }

    const response = await ezTexting.sendMessage({
      $,
      data: {
        message,
        toNumbers,
        groupIds,
        fromNumber,
        messageType,
        mediaUrl,
        mediaFileId,
        messageTemplateId,
        companyName,
        sendAt,
        strictValidation,
      },
    });

    const recipients = [
      toNumbers?.length && `${toNumbers.length} number(s)`,
      groupIds?.length && `${groupIds.length} group(s)`,
    ].filter(Boolean).join(" and ");

    $.export("$summary", sendAt
      ? `Successfully scheduled message to ${recipients} for ${sendAt}`
      : `Successfully sent message to ${recipients}`);

    return response;
  },
};
