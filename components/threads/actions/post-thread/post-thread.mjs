import threads from "../../threads.app.mjs";

export default {
  key: "threads-post-thread",
  name: "Post a Thread",
  description: "Post a new thread to a specific forum",
  version: "0.1.1",
  type: "action",
  props: {
    threads,
    channelID: {
      propDefinition: [
        threads,
        "channelID",
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
      channelID,
      body,
    } = this;

    const post = await this.threads.postThread({
      $,
      channelID,
      body,
    });

    $.export("$summary", `Thread successfully posted "${post?.result?.threadID}"`);
    return post;
  },
};
