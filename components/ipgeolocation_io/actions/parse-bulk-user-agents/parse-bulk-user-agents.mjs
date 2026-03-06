import ipgeolocation_io from "../../ipgeolocation_io.app.mjs";

export default {
  key: "ipgeolocation_io-parse-bulk-user-agent",
  name: "Parse Bulk User Agent",
  description:
    "Extract browser, device, operating system, and engine details from multiple user agent strings in a single request. Maximum 50,000 strings per request. Only available on paid plans. [See the documentation](https://ipgeolocation.io/documentation/user-agent-api.html#parse-bulk-user-agent-strings)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    ipgeolocation_io,
    uaStrings: {
      type: "string[]",
      label: "User Agent Strings",
      description: "List of user agent strings to parse. Maximum 50,000 per request",
    },
  },
  async run({ $ }) {
    const response = await this.ipgeolocation_io._makeRequest({
      method: "POST",
      path: "/user-agent-bulk",
      data: {
        uaStrings: this.uaStrings,
      },
    });
    $.export("$summary", `Successfully parsed ${this.uaStrings.length} user agent string${this.uaStrings.length === 1
      ? ""
      : "s"}`);
    return response;
  },
};
