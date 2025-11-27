import { ConfigurationError } from "@pipedream/platform";
import app from "../../sendblue.app.mjs";

export default {
  key: "sendblue-send-group-message",
  name: "Send Group Message",
  description: "Send a message to a group of recipients in an iMessage group",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    fromNumber: {
      propDefinition: [
        app,
        "fromNumber",
      ],
    },
    groupId: {
      propDefinition: [
        app,
        "groupId",
      ],
    },
    toNumbers: {
      type: "string[]",
      label: "To Numbers",
      description: "The phone numbers of the recipients in E.164 format (e.g., `+12025551234`)",
      optional: true,
      propDefinition: [
        app,
        "toNumber",
      ],
    },
    content: {
      propDefinition: [
        app,
        "content",
      ],
    },
    mediaUrl: {
      propDefinition: [
        app,
        "mediaUrl",
      ],
    },
  },
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
    idempotentHint: false,
  },
  async run({ $ }) {
    const {
      app,
      fromNumber,
      groupId,
      toNumbers,
      content,
      mediaUrl,
    } = this;

    if (!groupId && (!toNumbers || toNumbers.length === 0)) {
      throw new ConfigurationError("At least one of **To Numbers** or **Group ID** is required");
    }

    const response = await app.sendGroupMessage({
      $,
      data: {
        from_number: fromNumber,
        group_id: groupId,
        numbers: toNumbers,
        content,
        media_url: mediaUrl,
      },
    });

    $.export("$summary", "Successfully sent message to group");
    return response;
  },
};
