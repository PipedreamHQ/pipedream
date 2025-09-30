// legacy_hash_id: a_jQiBeL
import Pusher from "pusher";

export default {
  key: "pusher-send-event-to-channel",
  name: "Send an Event to a Channel",
  description: "Send an event to a channel using Pusher's npm package",
  version: "0.2.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    pusher: {
      type: "app",
      app: "pusher",
    },
    channel: {
      type: "string",
    },
    eventName: {
      type: "string",
    },
    event: {
      type: "string",
    },
  },
  async run() {
    const {
      appId,
      key,
      secret,
      cluster,
    } = this.pusher.$auth;
    const pusher = new Pusher({
      appId,
      key,
      secret,
      cluster,
      useTLS: true,
    });

    await pusher.trigger(this.channel, this.eventName, this.event);
  },
};
