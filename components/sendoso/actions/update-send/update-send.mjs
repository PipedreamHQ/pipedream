import sendoso from "../../sendoso.app.mjs";

export default {
  key: "sendoso-update-send",
  name: "Update Send",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Update information for an existing send. [See the documentation](https://sendoso.docs.apiary.io/#reference/send-management)",
  type: "action",
  props: {
    sendoso,
    sendId: {
      propDefinition: [
        sendoso,
        "sendId",
      ],
      description: "The unique ID of the send to update.",
    },
    customMessage: {
      type: "string",
      label: "Custom Message",
      description: "Updated custom message for the send.",
      optional: true,
    },
    notes: {
      type: "string",
      label: "Notes",
      description: "Internal notes about the send.",
      optional: true,
    },
    metadata: {
      type: "object",
      label: "Metadata",
      description: "Additional metadata for the send (JSON object).",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      sendId,
      customMessage,
      notes,
      metadata,
    } = this;

    const data = {};
    if (customMessage) data.custom_message = customMessage;
    if (notes) data.notes = notes;
    if (metadata) data.metadata = metadata;

    const response = await this.sendoso.updateSend({
      $,
      sendId,
      ...data,
    });

    $.export("$summary", `Successfully updated send ID: ${sendId}`);
    return response;
  },
};

