import svix from "../../svix.app.mjs";

export default {
  key: "svix-create-message",
  name: "Create Message",
  description: "Creates a new message and dispatches it to all of the application's endpoints. [See the docs here](https://api.svix.com/docs#tag/Message/operation/create_message_api_v1_app__app_id__msg__post)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    svix,
    appId: {
      propDefinition: [
        svix,
        "appId",
      ],
    },
    eventType: {
      propDefinition: [
        svix,
        "eventTypes",
      ],
      type: "string",
      label: "Event Type",
      description: "The event type to dispatch",
    },
    payload: {
      type: "object",
      label: "Payload",
      description: "Body of the message",
    },
    payloadRetentionPeriod: {
      type: "integer",
      label: "Payload Retention Period",
      description: "The retention period for the payload (in days)",
      optional: true,
      default: 90,
    },
  },
  async run({ $ }) {
    const data = {
      eventType: this.eventType,
      payload: this.payload,
      payloadRetentionPeriod: this.payloadRetentionPeriod,
    };
    const response = await this.svix.createMessage(this.appId, {
      data,
      $,
    });
    $.export("$summary", `Successfully created message with ID ${response.id}`);
    return response;
  },
};
