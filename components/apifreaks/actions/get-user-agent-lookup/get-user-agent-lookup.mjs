import app from "../../apifreaks.app.mjs";

export default {
  key: "apifreaks-get-user-agent-lookup",
  name: "User Agent Lookup",
  description: "Parse User Agent string to get detailed browser, device, and operating system information [See the documentation](https://apifreaks.com/docs).",
  version: "0.0.1",
  type: "action",
  props: {
    app,

  },
  async run({ $ }) {
    const response = await this.app._makeRequest({
      $,
      method: "GET",
      path: "/v1.0/user-agent/lookup",
    });
    $.export("$summary", "Successfully executed User Agent Lookup");
    return response;
  },
};
