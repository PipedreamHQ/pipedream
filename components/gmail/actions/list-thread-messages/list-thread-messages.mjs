import gmail from "../../gmail.app.mjs";

export default {
  key: "gmail-list-thread-messages",
  name: "List Thread Messages",
  description: "List messages in a thread. [See the docs](https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.threads/get)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    gmail,
    threadId: {
      propDefinition: [
        gmail,
        "threadId",
      ],
    },
  },
  async run({ $ }) {
    const { messages = [] } = await this.gmail.getThread({
      threadId: this.threadId,
    });

    const suffix = messages.length === 1
      ? ""
      : "s";
    $.export("$summary", `Successfully listed ${messages.length} message${suffix}`);
    return messages;
  },
};
