import app from "../../apifreaks.app.mjs";

export default {
  key: "apifreaks-bulk-ip-lookup",
  name: "Bulk IP Geolocation Lookup",
  description: "Retrieve detailed geolocation data for multiple IP addresses in a single request. Supports up to \`50,000\` IP-addresses/host-names per request. [See the documentation](https://apifreaks.com/docs).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    lang: {
      type: "string",
      label: "Lang",
      description: "Language of the response.",
      optional: true,
    },
    fields: {
      type: "string",
      label: "Fields",
      description: "Comma-separated list of fields to include in the response. Can include \"geo\".",
      optional: true,
    },
    excludes: {
      type: "string",
      label: "Excludes",
      description: "Comma-separated list of fields to exclude from the response (except \"ip\").",
      optional: true,
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
      path: "/v1.0/geolocation/lookup",
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
    $.export("$summary", "Successfully executed Bulk IP Geolocation Lookup");
    return response;
  },
};
