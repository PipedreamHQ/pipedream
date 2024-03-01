import blueskyByUnshape from "../../bluesky_by_unshape.app.mjs";

export default {
  key: "bluesky_by_unshape-get-post",
  name: "Get Post",
  description: "Fetches a post from Bluesky using its URL. [See the documentation](https://unshape.readme.io/reference/get_bluesky-post)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    blueskyByUnshape,
    url: {
      propDefinition: [
        blueskyByUnshape,
        "url",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.blueskyByUnshape.fetchPost({
      url: this.url,
    });
    $.export("$summary", `Fetched post with URL: ${this.url}`);
    return response;
  },
};
