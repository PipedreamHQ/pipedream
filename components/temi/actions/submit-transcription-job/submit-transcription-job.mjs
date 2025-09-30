import app from "../../temi.app.mjs";

export default {
  key: "temi-submit-transcription-job",
  name: "Submit Transcription Job",
  description: "Submits a job passing a media URL. [See the docs](https://www.temi.com/api/reference/v1#submit-job).",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    mediaUrl: {
      propDefinition: [
        app,
        "mediaUrl",
      ],
    },
    metadata: {
      propDefinition: [
        app,
        "metadata",
      ],
    },
  },
  async run({ $: step }) {
    const {
      mediaUrl,
      metadata,
    } = this;

    const response = await this.app.submitJob({
      step,
      data: {
        media_url: mediaUrl,
        metadata,
      },
    });

    step.export("$summary", `Successfully submitted a job with ID ${response.id}`);

    return response;
  },
};
