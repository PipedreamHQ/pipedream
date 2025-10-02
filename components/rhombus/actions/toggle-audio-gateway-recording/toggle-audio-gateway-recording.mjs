import rhombus from "../../rhombus.app.mjs";

export default {
  key: "rhombus-toggle-audio-gateway-recording",
  name: "Toggle Audio Gateway Recording",
  description: "Update audio gateway settings to enable or disable audio recording. [See the documentation](https://apidocs.rhombus.com/reference/updateaudiogatewayconfig)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
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
    enableRecording: {
      type: "boolean",
      label: "Enable Recording",
      description: "Set to true to enable audio recording, false to disable",
      default: true,
    },
  },
  async run({ $ }) {
    // First, get the current configuration to preserve other settings
    const currentConfig = await this.rhombus.getAudioGatewayConfig({
      $,
      data: {
        audioGatewayUuid: this.audioGatewayUuid,
      },
    });

    // Update the configuration with the new recording setting
    const response = await this.rhombus.updateAudioGatewayConfig({
      $,
      data: {
        uuid: this.audioGatewayUuid,
        config: {
          ...currentConfig.config, // Preserve existing config
          audioRecord: this.enableRecording,
        },
      },
    });

    const action = this.enableRecording
      ? "enabled"
      : "disabled";
    $.export("$summary", `${action} audio recording for audio gateway ${this.audioGatewayUuid}`);
    return response;
  },
};
