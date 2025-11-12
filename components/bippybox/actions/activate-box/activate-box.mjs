import app from "../../bippybox.app.mjs";

export default {
  key: "bippybox-activate-box",
  name: "Activate Box",
  description: "Triggers the BippyBox to play an audio file. [See the documentation](https://bippybox.io/docs/).",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    device: {
      type: "string",
      label: "Device",
      description: "The device identifier. Eg. `DEVICE123`.",
    },
    url: {
      type: "string",
      label: "URL",
      description: "The URL of the audio file to play. Eg. `https://storage.example.com/users/exampleUserUID67890/audio/SampleAudioFile.wav?alt=media&token=exampleToken123456`.",
    },
  },
  async run({ $ }) {
    const {
      app,
      device,
      url,
    } = this;

    const response = await app.activateBox({
      $,
      data: {
        device,
        URL: url,
      },
    });
    $.export("$summary", "Successfully activated BippyBox.");
    return response;
  },
};
