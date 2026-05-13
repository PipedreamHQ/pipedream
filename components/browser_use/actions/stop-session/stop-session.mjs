import browserUse from "../../browser_use.app.mjs";
import { STOP_STRATEGY_OPTIONS } from "../../common/constants.mjs";

export default {
  key: "browser_use-stop-session",
  name: "Stop Session",
  description: "Stop the current task or stop the entire Browser Use agent session. [See the documentation](https://docs.browser-use.com/cloud/api-v3/sessions/stop-session)",
  version: "0.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
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
    strategy: {
      type: "string",
      label: "Stop Strategy",
      description: "Use `task` to stop only the current task and keep the session alive, or `session` to destroy the sandbox entirely.",
      options: STOP_STRATEGY_OPTIONS,
      optional: true,
      default: "session",
    },
  },
  async run({ $ }) {
    const response = await this.browserUse.stopSession({
      $,
      sessionId: this.sessionId,
      data: {
        strategy: this.strategy,
      },
    });

    $.export("$summary", `Stopped ${this.strategy} for session ${this.sessionId}`);
    return response;
  },
};
