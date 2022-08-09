import app from "../../tumblr.app.mjs";

export default {
  name: "Create Text Post",
  description: "Create a text post on Tumblr. [See the docs here](https://www.tumblr.com/docs/en/api/v2#posts---createreblog-a-post-neue-post-format)",
  key: "tumblr-create-text-post",
  version: "0.0.1",
  type: "action",
  props: {
    app,
  },
  async run({ $ }) {
    this.app.authKeys();
    $.export("$summary", "Post successfully created");
  },
};

