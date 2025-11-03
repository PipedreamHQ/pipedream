import threads from "../../threads.app.mjs";

export default {
  key: "threads-post-thread",
  name: "Post a Thread",
  description: "Post a new thread to a specific channel. [See the Documentation](https://github.com/ThreadsHQ/api-documentation#post-thread).",
  version: "0.2.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    threads,
    channelID: {
      propDefinition: [
        threads,
        "channelID",
      ],
    },
    blocks: {
      propDefinition: [
        threads,
        "blocks",
      ],
    },
  },
  async run({ $ }) {
    const {
      channelID,
      blocks,
    } = this;

    const post = await this.threads.postThread({
      $,
      channelID,
      blocks,
    });

    $.export("$summary", `Thread successfully posted "${post?.result?.threadID}"`);
    return post;
  },
};
