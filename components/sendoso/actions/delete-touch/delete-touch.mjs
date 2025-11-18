import sendoso from "../../sendoso.app.mjs";

export default {
  key: "sendoso-delete-touch",
  name: "Delete Touch",
  version: "0.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Delete a touch. [See the documentation](https://sendoso.docs.apiary.io/#reference/touch-management)",
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
      description: "The unique ID of the touch to delete.",
    },
  },
  async run({ $ }) {
    const { touchId } = this;

    const response = await this.sendoso.deleteTouch({
      $,
      touchId,
    });

    $.export("$summary", `Successfully deleted touch ID: ${touchId}`);
    return response;
  },
};

