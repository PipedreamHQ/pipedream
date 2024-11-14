import slybroadcast from "../../slybroadcast.app.mjs";

export default {
  key: "slybroadcast-start-campaign-audio-file",
  name: "Start Campaign with Audio File",
  description: "Start a new voicemail campaign using an audio file uploaded to your slybroadcast account.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    slybroadcast,
    audioFileId: {
      propDefinition: [
        slybroadcast,
        "audioFileId",
      ],
    },
    recipients: {
      propDefinition: [
        slybroadcast,
        "recipients",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.slybroadcast.startCampaignWithFileId({
      audioFileId: this.audioFileId,
      recipients: this.recipients,
    });
    $.export("$summary", `Started campaign with audio file ID: ${this.audioFileId}`);
    return response;
  },
};
