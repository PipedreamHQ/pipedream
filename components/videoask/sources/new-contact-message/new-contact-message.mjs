import common from "../common/base-webhook.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "videoask-new-contact-message",
  name: "New Contact Message (Instant)",
  description: "Emit new event when a message is sent by the contact and the video/audio media is transcoded and transcribed. [See the documentation](https://developers.videoask.com/#a81f427b-6726-46c5-ac2a-a2317bd602c6)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventTypes() {
      return [
        "form_contact_message",
      ];
    },
  },
  sampleEmit,
};
