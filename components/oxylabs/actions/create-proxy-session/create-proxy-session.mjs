import oxylabs from "../../oxylabs.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "oxylabs-create-proxy-session",
  name: "Create Proxy Session",
  description: "Establish a proxy session using the Residential Proxy endpoint. [See the documentation](https://developers.oxylabs.io/proxies/residential-proxies/session-control#establishing-session)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    oxylabs,
    username: {
      type: "string",
      label: "Username",
      description: "The username for the proxy user",
    },
    password: {
      type: "string",
      label: "Password",
      description: "The password for the proxy user",
    },
    sessid: {
      type: "string",
      label: "Session ID",
      description: "Session ID to keep the same IP with upcoming queries. The session expires in 10 minutes. After that, a new IP address is assigned to that session ID. Random string, 0-9, and A-Z characters are supported.",
    },
    cc: {
      type: "string",
      label: "Country Code",
      description: "Case insensitive country code in 2-letter [3166-1 alpha-2 format](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2)",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "Case insensitive city name in English. This parameter must be accompanied by cc for better accuracy.",
      optional: true,
    },
    st: {
      type: "string",
      label: "State",
      description: "Case insensitive US state name with us_ in the beginning, for example, `us_california`, `us_illinois`",
      optional: true,
    },
    sstime: {
      type: "string",
      label: "Session Time",
      description: "Session time in minutes. The session time parameter keeps the same IP for a certain period. The maximum session time is 30 minutes.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      username,
      password,
      sessid,
      cc,
      city,
      st,
      sstime,
    } = this;

    if (city && !cc) {
      throw new ConfigurationError("City must be accompanied by country code");
    }

    const proxyUrl = `http://customer-${username}${cc
      ? `-cc-${cc}`
      : ""}${city
      ? `-city-${city}`
      : ""}${st
      ? `-st-${st}`
      : ""}${sessid
      ? `-sessid-${sessid}`
      : ""}${sstime
      ? `-sstime-${sstime}`
      : ""}:${password}@pr.oxylabs.io:7777`;
    const response = await this.oxylabs.createSession({
      $,
      proxyUrl,
    });
    $.export("$summary", `Successfully created proxy session with session ID: ${this.sessid}`);
    return response;
  },
};
