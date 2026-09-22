import browserUse from "../../browser_use.app.mjs";

export default {
  key: "browser_use-get-browser-session",
  name: "Get Browser Session",
  description: "Get details for a standalone Browser Use browser session, including live URL, CDP URL, status, timeout, and cost fields. [See the documentation](https://docs.browser-use.com/cloud/api-v3/browsers/get-browser-session)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
  },
  async run({ $ }) {
    const response = await this.browserUse.getBrowserSession({
      $,
      browserSessionId: this.browserSessionId,
    });

    $.export("$summary", `Retrieved browser session ${response.id} with status ${response.status}`);
    return response;
  },
};
