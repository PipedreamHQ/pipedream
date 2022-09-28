import threads from "../../threads.app.mjs";

export default {
  key: "threads-post-thread",
  name: "Post a Thread",
  description: "Post a new thread to a specific forum",
  version: "0.1.0",
  type: "action",
  props: {
    threads,
    ChannelID: {
      propDefinition: [
        threads,
        "ChannelID",
      ],
    },
    body: {
      propDefinition: [
        threads,
        "body",
      ],
    },
  },
  async run({ $ }) {
    const {
      ChannelID,
      body,
    } = this;

    const post = await this.threads.postThread({
      $,
      ChannelID,
      body,
    });

    $.export("$summary", `Thread successfully posted "${post?.result?.threadID}"`);
    return post;
  },
};
