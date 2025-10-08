import app from "../../gistly.app.mjs";

export default {
  key: "gistly-get-transcript",
  name: "Get Transcript",
  description:
    "Fetches transcript/subtitles from a YouTube video using Gistly API.",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    videoUrl: {
      propDefinition: [
        app,
        "videoUrl",
      ],
      optional: true,
    },
    videoId: {
      propDefinition: [
        app,
        "videoId",
      ],
      optional: true,
    },
    text: {
      propDefinition: [
        app,
        "text",
      ],
    },
    chunkSize: {
      propDefinition: [
        app,
        "chunkSize",
      ],
    },
  },
  async run({ $ }) {
    const params = {
      url: this.videoUrl,
      videoId: this.videoId,
      text: this.text,
      chunkSize: this.chunkSize,
    };

    const response = await this.app.getTranscript({
      $,
      params,
    });

    $.export("$summary", "Successfully fetched the transcript for the video.");
    return response;
  },
};
