import signalwire from "../../signalwire.app.mjs";

export default {
  key: "signalwire-create-video-conference",
  name: "Create Video Conference",
  description: "Creates a video conference on SignalWire. [See the documentation](https://developer.signalwire.com/rest/create-a-video-conference)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    signalwire,
    name: signalwire.propDefinitions.name,
    displayName: signalwire.propDefinitions.displayName,
    joinFrom: signalwire.propDefinitions.joinFrom,
    joinUntil: signalwire.propDefinitions.joinUntil,
    quality: signalwire.propDefinitions.quality,
    layout: signalwire.propDefinitions.layout,
    size: signalwire.propDefinitions.size,
    recordOnStart: signalwire.propDefinitions.recordOnStart,
    enableRoomPreviews: signalwire.propDefinitions.enableRoomPreviews,
    enableChat: signalwire.propDefinitions.enableChat,
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
    });
    $.export("$summary", `Successfully created video conference: ${this.name}`);
    return response;
  },
};
