import browserUse from "../../browser_use.app.mjs";
import { cleanObject } from "../../common/utils.mjs";

export default {
  key: "browser_use-list-session-messages",
  name: "List Session Messages",
  description: "List messages from a Browser Use agent session, including reasoning, tool calls, browser actions, screenshots, and results. [See the documentation](https://docs.browser-use.com/cloud/api-v3/sessions/list-session-messages)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    browserUse,
    sessionId: {
      propDefinition: [
        browserUse,
        "sessionId",
      ],
    },
    after: {
      type: "string",
      label: "After Message ID",
      description: "Return messages after this message ID cursor. Example: `3c90c3cc-0d44-4b50-8888-8dd25736052a`.",
      optional: true,
    },
    before: {
      type: "string",
      label: "Before Message ID",
      description: "Return messages before this message ID cursor. Example: `3c90c3cc-0d44-4b50-8888-8dd25736052a`.",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of messages to return. Maximum: `100`.",
      optional: true,
      default: 10,
      min: 1,
      max: 100,
    },
  },
  async run({ $ }) {
    const response = await this.browserUse.listSessionMessages({
      $,
      sessionId: this.sessionId,
      params: cleanObject({
        after: this.after,
        before: this.before,
        limit: this.limit,
      }),
    });

    $.export("$summary", `Retrieved ${response.messages?.length ?? 0} messages from session ${this.sessionId}`);
    return response;
  },
};
