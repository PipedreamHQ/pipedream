import ipgeolocation from "../../ipgeolocation.app.mjs";

export default {
  key: "ipgeolocation-parse-user-agent",
  name: "Parse User Agent",
  description:
    "Extract browser, device, operating system, and engine details from a user agent string. Only available on paid plans. [See the documentation](https://ipgeolocation.io/documentation/user-agent-api.html)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    ipgeolocation,
    uaString: {
      type: "string",
      label: "User Agent String",
      description: "The user agent string to parse (e.g. `Mozilla/5.0 (Windows NT 10.0; Win64; x64)...`)",
    },
  },
  async run({ $ }) {
    const response = await this.ipgeolocation.parseUserAgent({
      $,
      data: {
        uaString: this.uaString,
      },
    });
    const truncatedUa = this.uaString.length > 50
      ? `${this.uaString.slice(0, 50)}...`
      : this.uaString;
    $.export("$summary", `Successfully parsed user agent string: ${truncatedUa}`);
    return response;
  },
};
