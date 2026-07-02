import app from "../../social_fetch.app.mjs";

export default {
  key: "social_fetch-get-reddit-post-transcript",
  name: "Get Reddit Post Transcript",
  description: "Get the captions transcript for a Reddit video post. [See the documentation](https://app.socialfetch.dev/playground?path=/v1/reddit/posts/transcript&method=GET)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    url: {
      propDefinition: [
        app,
        "redditPostUrl",
      ],
    },
    language: {
      propDefinition: [
        app,
        "language",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getPostTranscript({
      $,
      url: this.url,
      language: this.language,
    });
    $.export("$summary", "Successfully fetched post transcript");
    return response;
  },
};
