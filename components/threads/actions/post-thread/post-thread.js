const threads = require("../../threads.app.js");

module.exports = {
  key: "threads-post-thread",
  name: "Post a Thread",
  description: "Post a new thread to a specific forum",
  version: "0.0.1",
  type: "action",
  props: {
    threads,
    forumID: {
      propDefinition: [
        threads,
        "forumID",
      ],
    },
    title: {
      propDefinition: [
        threads,
        "title",
      ],
    },
    body: {
      propDefinition: [
        threads,
        "body",
      ],
    },
  },
  async run() {
    const {
      forumID,
      title,
      body,
    } = this;
    return await this.threads.postThread({
      forumID,
      title,
      body,
    });
  },
};
