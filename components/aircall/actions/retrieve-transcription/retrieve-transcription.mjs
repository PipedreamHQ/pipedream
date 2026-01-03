import app from "../../aircall.app.mjs";

export default {
  name: "Retrieve Transcription",
  description:
    "Retrieves AI-generated transcription for a specific Aircall call. Requires the AI Assist add-on to be enabled on your Aircall account. [See the docs here](https://developer.aircall.io/api-references/#retrieve-a-transcription)",
  key: "aircall-retrieve-transcription",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    call: {
      propDefinition: [app, "call"],
    },
  },
  async run({ $ }) {
    const { transcription } = await this.app.retrieveTranscription(
      this.call,
      $
    );

    $.export(
      "$summary",
      `Successfully retrieved transcription with ID ${transcription.id}`
    );

    return transcription;
  },
};
