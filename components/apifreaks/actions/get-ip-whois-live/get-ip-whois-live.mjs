import app from "../../apifreaks.app.mjs";

export default {
  key: "apifreaks-get-ip-whois-live",
  name: "IP WHOIS Lookup",
  description: "Returns WHOIS registration details for a specified IP address (IPv4 or IPv6). [See the documentation](https://apifreaks.com/docs).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    ip: {
      type: "string",
      label: "Ip",
      description: "The IP address (IPv4 or IPv6) for which WHOIS data is requested.",
      optional: false,
    },
  },
  async run({ $ }) {
    const response = await this.app._makeRequest({
      $,
      method: "GET",
      path: "/v1.0/ip/whois/live",
      params: {
        ip: this.ip,
      },
    });
    $.export("$summary", "Successfully executed IP WHOIS Lookup");
    return response;
  },
};
