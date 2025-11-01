import app from "../../proxy_spider.app.mjs";

export default {
  key: "proxy_spider-list-proxies",
  name: "List Proxies",
  description: "List proxies from Proxy Spider. [See the documentation](https://proxy-spider.com/docs/api/public-proxies)",
  version: "0.0.1",
  annotations: {
    openWorldHint: true,
    destructiveHint: false,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    limit: {
      propDefinition: [
        app,
        "limit",
      ],
    },
    countryCode: {
      propDefinition: [
        app,
        "countryCode",
      ],
    },
    responseTime: {
      propDefinition: [
        app,
        "responseTime",
      ],
    },
    protocols: {
      propDefinition: [
        app,
        "protocols",
      ],
    },
    type: {
      propDefinition: [
        app,
        "type",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.listProxies({
      $,
      params: {
        limit: this.limit,
        country_code: this.countryCode?.join(","),
        response_time: this.responseTime?.join(","),
        protocols: this.protocols?.join(","),
        type: this.type?.join(","),
      },
    });
    $.export("$summary", "Successfully sent the request. Retrieved " + response.data.proxies.length + " proxies");
    return response;
  },
};
