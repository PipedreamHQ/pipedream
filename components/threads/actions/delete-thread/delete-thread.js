const threads = require("../../threads.app.js");

module.exports = {
  key: "threads-delete-thread",
  name: "Delete a Thread",
  description: "Delete a thread",
  version: "0.0.1",
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
  async run() {
    return await this.threads.deleteThread({
      threadID: this.threadID,
    });
  },
};
