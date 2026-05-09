import browserUse from "../../browser_use.app.mjs";
import { BROWSER_SESSION_UPDATE_ACTION_OPTIONS } from "../../common/constants.mjs";

export default {
  key: "browser_use-update-browser-session",
  name: "Update Browser Session",
  description: "Update a standalone Browser Use browser session. Currently, Browser Use supports the `stop` action. [See the documentation](https://docs.browser-use.com/cloud/api-v3/browsers/update-browser-session)",
  version: "0.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    browserUse,
    browserSessionId: {
      propDefinition: [
        browserUse,
        "browserSessionId",
      ],
    },
    action: {
      type: "string",
      label: "Action",
      description: "Action to perform on the browser session. Currently supported value: `stop`.",
      options: BROWSER_SESSION_UPDATE_ACTION_OPTIONS,
      default: "stop",
    },
  },
  async run({ $ }) {
    const response = await this.browserUse.updateBrowserSession({
      $,
      browserSessionId: this.browserSessionId,
      data: {
        action: this.action,
      },
    });

    $.export("$summary", `Performed ${this.action} on browser session ${this.browserSessionId}`);
    return response;
  },
};
