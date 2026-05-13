import xquik from "../../xquik.app.mjs";

export default {
  key: "xquik-get-tweet",
  name: "Get Tweet",
  description:
    "Get a public X/Twitter post by ID with Xquik. [See the documentation](https://docs.xquik.com/api-reference/overview)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    xquik,
    tweetId: {
      propDefinition: [xquik, "tweetId"],
    },
  },
  async run({ $ }) {
    const response = await this.xquik.getTweet({
      $,
      tweetId: this.tweetId,
    });

    $.export("$summary", "Successfully retrieved tweet");
    return response;
  },
};
