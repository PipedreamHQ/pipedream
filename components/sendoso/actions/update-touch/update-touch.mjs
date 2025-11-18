import sendoso from "../../sendoso.app.mjs";

export default {
  key: "sendoso-update-touch",
  name: "Update Touch",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Update an existing touch. [See the documentation](https://sendoso.docs.apiary.io/#reference/touch-management)",
  type: "action",
  props: {
    sendoso,
    groupId: {
      propDefinition: [
        sendoso,
        "groupId",
      ],
    },
    touchId: {
      propDefinition: [
        sendoso,
        "touchId",
        (c) => ({
          groupId: c.groupId,
        }),
      ],
      description: "The unique ID of the touch to update.",
    },
    name: {
      type: "string",
      label: "Touch Name",
      description: "Updated name of the touch.",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "Updated description of the touch.",
      optional: true,
    },
    customMessage: {
      type: "string",
      label: "Custom Message",
      description: "Updated custom message for the touch.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      touchId,
      name,
      description,
      customMessage,
    } = this;

    const data = {};
    if (name) data.name = name;
    if (description) data.description = description;
    if (customMessage) data.custom_message = customMessage;

    const response = await this.sendoso.updateTouch({
      $,
      touchId,
      ...data,
    });

    $.export("$summary", `Successfully updated touch ID: ${touchId}`);
    return response;
  },
};

