import figma from "../../figma.app.mjs";

export default {
  name: "Post a Comment",
  description: "Posts a comment to a file.",
  key: "figma-post-a-comment",
  version: "0.0.1",
  type: "action",
  props: {
    figma,
  },
  async run() {
    this.figma.authKeys();
    return "ok";
  },
};
