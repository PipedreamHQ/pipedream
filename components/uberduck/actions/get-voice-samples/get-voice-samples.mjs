import uberduck from "../../uberduck.app.mjs";

export default {
  key: "uberduck-get-voice-samples",
  name: "Get Voice Samples",
  description: "Get voice samples for a specific voice model. [See the documentation](https://docs.uberduck.ai/reference/list-voice-samples)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    uberduck,
    voicemodelUuid: {
      propDefinition: [
        uberduck,
        "voicemodelUuid",
        (c) => ({
          mode: c.mode,
          language: c.language,
          isPrivate: c.isPrivate,
          owner: c.owner,
          name: c.name,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.uberduck.listVoiceSamples({
      $,
      voicemodelUuid: this.voicemodelUuid,
    });

    $.export("$summary", `Retrieved ${response.length} voice samples for voice model UUID ${this.voicemodelUuid}`);

    return response;
  },
};
