import bluesky from "../../bluesky_by_unshape.app.mjs";

export default {
  key: "bluesky_by_unshape-get-post",
  name: "Get Post",
  description: "Fetches a post from Bluesky using its URL. [See the documentation](https://unshape.readme.io/reference/get_bluesky-post)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    bluesky,
    url: {
      propDefinition: [
        bluesky,
        "url",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.bluesky.fetchPost({
      $,
      params: {
        postUrl: this.url,
      },
    });
    $.export("$summary", `Fetched post with URL: ${this.url}`);
    return response;
  },
};
