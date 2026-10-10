import app from "../../apifreaks.app.mjs";

export default {
  key: "apifreaks-bulk-ip-lookup-v2",
  name: "Bulk IP Geolocation Lookup (V2.0)",
  description: "Retrieve detailed geolocation data for multiple IP addresses in a single request. Supports up to `50,000` IP-addresses/host-names per request. - v2.0 response format. [See the documentation](https://apifreaks.com/docs).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    lang: {
      type: "string",
      label: "Lang",
      description: "Language of the response.",
      optional: true,
      options: ["en","de","ru","ja","fr","cn","es","cs","it","ko","fa","pt"],
    },
    fields: {
      propDefinition: [
        app,
        "fields",
      ],
    },
    excludes: {
      propDefinition: [
        app,
        "excludes",
      ],
    },
    include: {
      type: "string",
      label: "Include",
      description: "Comma-separated list of additional information to include in the response.",
      optional: true,
    },
    ips: {
      type: "string",
      label: "Ips",
      description: "List of IP addresses or hostnames to lookup",
      optional: false,
    },
  },
  async run({ $ }) {
    const response = await this.app._makeRequest({
      $,
      method: "POST",
      path: "/v2.0/geolocation/lookup",
      params: {
        lang: this.lang,
        fields: this.fields,
        excludes: this.excludes,
        include: this.include,
      },
      data: {
        ips: this.ips,
      },
    });
    $.export("$summary", "Successfully executed Bulk IP Geolocation Lookup (V2.0)");
    return response;
  },
};
