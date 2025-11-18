import sendoso from "../../sendoso.app.mjs";

export default {
  key: "sendoso-get-touch",
  name: "Get Touch",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Retrieve details about a specific touch. [See the documentation](https://sendoso.docs.apiary.io/#reference/touch-management)",
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
      description: "The unique ID of the touch to retrieve.",
    },
  },
  async run({ $ }) {
    const { touchId } = this;

    const response = await this.sendoso.getTouch({
      $,
      touchId,
    });

    $.export("$summary", `Successfully retrieved touch ID: ${touchId}`);
    return response;
  },
};

