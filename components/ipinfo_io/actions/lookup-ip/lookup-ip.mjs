import ipinfo_io from "../../ipinfo_io.app.mjs";

export default {
  name: "Lookup Ip",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  key: "ipinfo_io-lookup-ip",
  description: "Lookup an IP. [See docs here](https://ipinfo.io/developers#ip-address-parameter)",
  type: "action",
  props: {
    ipinfo_io,
    ip: {
      label: "IP",
      description: "The IP to lookup. E.g. `125.75.86.65`, `2001:4860:4860::8888` or `8.8.8.8`",
      type: "string",
    },
  },
  async run({ $ }) {
    const response = await this.ipinfo_io.lookupIP({
      $,
      ip: this.ip,
    });

    if (response) {
      $.export("$summary", `Successfully looked up IP \`${this.ip}\``);
    }

    return response;
  },
};
