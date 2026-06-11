import xquik from "../../xquik.app.mjs";

export default {
  key: "xquik-download-tweet-media",
  name: "Download Tweet Media",
  description: "Download images and videos from a public X/Twitter post with Xquik. [See the documentation](https://docs.xquik.com/api-reference/x/download-media)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    xquik,
    tweetInput: {
      propDefinition: [
        xquik,
        "tweetInput",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.xquik.downloadTweetMedia({
      $,
      tweetInput: this.tweetInput,
    });

    const summary = response?.totalMedia !== undefined
      ? `Downloaded ${response.totalMedia} media items`
      : `Created media gallery for ${response?.tweetId ?? this.tweetInput}`;
    const galleryUrl = response?.galleryUrl
      ? ` Gallery: ${response.galleryUrl}`
      : "";

    $.export("$summary", `${summary}.${galleryUrl}`);
    return response;
  },
};
