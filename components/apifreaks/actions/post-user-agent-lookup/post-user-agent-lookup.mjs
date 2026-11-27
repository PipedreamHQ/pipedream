import app from "../../apifreaks.app.mjs";

export default {
  key: "apifreaks-post-user-agent-lookup",
  name: "Bulk User Agent Lookup",
  description: "Parse up to `50,000 User-Agent strings` at once in a single request. [See the documentation](https://apifreaks.com/docs).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    uaStrings: {
      type: "string",
      label: "Uastrings",
      description: "List of user agent strings to parse",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app._makeRequest({
      $,
      method: "POST",
      path: "/v1.0/user-agent/lookup",
      data: {
        uaStrings: this.uaStrings,
      },
    });
    $.export("$summary", "Successfully executed Bulk User Agent Lookup");
    return response;
  },
};
