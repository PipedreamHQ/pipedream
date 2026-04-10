import { parseObject } from "../../common/utils.mjs";
import helpwise from "../../helpwise.app.mjs";

export default {
  key: "helpwise-close-conversation",
  name: "Close Conversation",
  description: "Closes conversations by its IDs. [See the documentation](https://documenter.getpostman.com/view/29744652/2s9YC5yYKf#333c4b46-0e2a-4f28-89e2-d77f969b7011)",
  version: "0.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    helpwise,
    threadIds: {
      propDefinition: [
        helpwise,
        "threadIds",
      ],
      description: "Thread IDs to close.",
    },
  },
  async run({ $ }) {
    const response = await this.helpwise.closeConversation({
      $,
      data: {
        ids: parseObject(this.threadIds),
      },
    });

    $.export("$summary", "Closed conversation(s) successfully");
    return response;
  },
};
