import app from "../../apifreaks.app.mjs";

export default {
  key: "apifreaks-get-vat-rates-ip-address",
  name: "Get VAT Rate by IP Address",
  description: "Fetches VAT rate based on the specified or originating IP address. [See the documentation](https://apifreaks.com/docs).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    ipAddress: {
      type: "string",
      label: "Ipaddress",
      description: "IPv4 or IPv6 address to look up VAT rate for. If omitted, the originating IP address will be used.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app._makeRequest({
      $,
      method: "GET",
      path: "/v1.0/vat/rates/ip-address",
      params: {
        ipAddress: this.ipAddress,
      },
    });
    $.export("$summary", "Successfully executed Get VAT Rate by IP Address");
    return response;
  },
};
