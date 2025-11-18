import sendoso from "../../sendoso.app.mjs";

export default {
  key: "sendoso-duplicate-touch",
  name: "Duplicate Touch",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Duplicate an existing touch. [See the documentation](https://sendoso.docs.apiary.io/#reference/touch-management)",
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
      description: "The unique ID of the touch to duplicate.",
    },
    newName: {
      type: "string",
      label: "New Touch Name",
      description: "Name for the duplicated touch.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      touchId,
      newName,
    } = this;

    const data = {};
    if (newName) data.name = newName;

    const response = await this.sendoso.duplicateTouch({
      $,
      touchId,
      ...data,
    });

    $.export("$summary", `Successfully duplicated touch ID: ${touchId}`);
    return response;
  },
};

