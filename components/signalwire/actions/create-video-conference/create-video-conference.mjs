import signalwire from "../../signalwire.app.mjs";

export default {
  key: "signalwire-create-video-conference",
  name: "Create Video Conference",
  description: "Creates a video conference on SignalWire. [See the documentation](https://developer.signalwire.com/rest/create-a-video-conference)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    signalwire,
    name: {
      propDefinition: [
        signalwire,
        "name",
      ],
    },
    displayName: {
      propDefinition: [
        signalwire,
        "displayName",
      ],
    },
    joinFrom: {
      propDefinition: [
        signalwire,
        "joinFrom",
      ],
    },
    joinUntil: {
      propDefinition: [
        signalwire,
        "joinUntil",
      ],
    },
    quality: {
      propDefinition: [
        signalwire,
        "quality",
      ],
    },
    layout: {
      propDefinition: [
        signalwire,
        "layout",
      ],
    },
    size: {
      propDefinition: [
        signalwire,
        "size",
      ],
    },
    recordOnStart: {
      propDefinition: [
        signalwire,
        "recordOnStart",
      ],
    },
    enableRoomPreviews: {
      propDefinition: [
        signalwire,
        "enableRoomPreviews",
      ],
    },
    enableChat: {
      propDefinition: [
        signalwire,
        "enableChat",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.signalwire.createVideoConference({
      data: {
        name: this.name,
        display_name: this.displayName,
        join_from: this.joinFrom,
        join_until: this.joinUntil,
        quality: this.quality,
        layout: this.layout,
        size: this.size,
        record_on_start: this.recordOnStart,
        enable_room_previews: this.enableRoomPreviews,
        enable_chat: this.enableChat,
      },
      $,
    });
    $.export("$summary", `Successfully created video conference: ${this.name}`);
    return response;
  },
};
