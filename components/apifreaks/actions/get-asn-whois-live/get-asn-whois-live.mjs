import app from "../../apifreaks.app.mjs";

export default {
  key: "apifreaks-get-asn-whois-live",
  name: "ASN WHOIS Lookup",
  description: "Returns WHOIS registration details for a specified ASN, with or without the 'as' prefix. [See the documentation](https://apifreaks.com/docs).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    asn: {
      type: "string",
      label: "Asn",
      description: "The Autonomous System Number (ASN) to retrieve WHOIS data for. Can be prefixed with 'as' or not.",
      optional: false,
    },
  },
  async run({ $ }) {
    const response = await this.app._makeRequest({
      $,
      method: "GET",
      path: "/v1.0/asn/whois/live",
      params: {
        asn: this.asn,
      },
    });
    $.export("$summary", "Successfully executed ASN WHOIS Lookup");
    return response;
  },
};
