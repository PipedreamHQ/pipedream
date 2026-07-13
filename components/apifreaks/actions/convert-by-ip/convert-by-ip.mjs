import app from "../../apifreaks.app.mjs";

export default {
  key: "apifreaks-convert-by-ip",
  name: "Convert Currency Based on IP Geolocation",
  description: "Converts an amount to the local currency of a given IP address. [See the documentation](https://apifreaks.com/docs).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    from: {
      type: "string",
      label: "From",
      description: "Source currency code.",
      optional: false,
    },
    ip: {
      type: "string",
      label: "Ip",
      description: "IPv4 or IPv6 address. Defaults to the request IP.",
      optional: true,
    },
    amount: {
      type: "string",
      label: "Amount",
      description: "Amount to convert as a positive decimal. Defaults to `1`.",
      optional: true,
    },
    updates: {
      type: "string",
      label: "Updates",
      description: "Update frequency: `1m` (default), `10m`, `1h`, or `1d`.",
      optional: true,
      options: ["1m","10m","1h","1d"],
    },
  },
  async run({ $ }) {
    const response = await this.app._makeRequest({
      $,
      method: "GET",
      path: "/v1.0/currency/converter/ip-to-currency",
      params: {
        from: this.from,
        ip: this.ip,
        amount: this.amount,
        updates: this.updates,
      },
    });
    $.export("$summary", "Successfully executed Convert Currency Based on IP Geolocation");
    return response;
  },
};
