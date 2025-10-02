import rhombus from "../../rhombus.app.mjs";

export default {
  key: "rhombus-play-audio-upload",
  name: "Play Audio Upload",
  description: "Play an uploaded audio clip through an audio device. [See the documentation](https://apidocs.rhombus.com/reference/playaudioupload)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    rhombus,
    audioGatewayUuid: {
      propDefinition: [
        rhombus,
        "audioGatewayUuid",
      ],
    },
    audioUploadUuid: {
      propDefinition: [
        rhombus,
        "audioUploadUuid",
      ],
    },
    loopDurationSec: {
      type: "integer",
      label: "Loop Duration (sec)",
      description: "The duration of the loop (in seconds)",
      optional: true,
    },
    playCount: {
      type: "integer",
      label: "Play Count",
      description: "The number of times to play the audio upload",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.rhombus.playAudioUpload({
      $,
      data: {
        audioGatewayUuids: [
          this.audioGatewayUuid,
        ],
        audioUploadUuid: this.audioUploadUuid,
        loopDurationSec: this.loopDurationSec,
        playCount: this.playCount,
      },
    });

    $.export("$summary", `Playing audio upload ${this.audioUploadUuid} through audio gateway ${this.audioGatewayUuid}`);
    return response;
  },
};
