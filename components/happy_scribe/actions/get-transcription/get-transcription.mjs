import app from "../../happy_scribe.app.mjs";

export default {
  name: "Get Transcription",
  version: "0.0.1",
  key: "happy_scribe-get-transcription",
  description: "Retrieve a transcription. [See the documentation](https://dev.happyscribe.com/sections/product/#transcriptions-list-all-transcriptions)",
  type: "action",
  props: {
    app,
    organizationId: {
      propDefinition: [
        app,
        "organizationId",
      ],
    },
    transcriptionId: {
      propDefinition: [
        app,
        "transcriptionId",
        (c) => ({
          organizationId: c.organizationId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getTranscription({
      $,
      transcriptionId: this.transcriptionId,
    });

    if (response.id) {
      $.export("$summary", `Successfully retrieved transcription with ID ${response.id}`);
    }

    return response;
  },
};
