import threads from "../../threads.app.mjs";

export default {
  key: "threads-delete-thread",
  name: "Delete a Thread",
  description: "Delete a thread. [See the Documentation](https://github.com/ThreadsHQ/api-documentation#delete-thread)",
  version: "0.1.4",
  type: "action",
  props: {
    threads,
    threadID: {
      propDefinition: [
        threads,
        "threadID",
      ],
    },
  },
  async run({ $ }) {
    const post = await this.threads.deleteThread({
      $,
      threadID: this.threadID,
    });

    $.export("$summary", `Thread successfully deleted "${this.threadID}"`);
    return post;
  },
};
