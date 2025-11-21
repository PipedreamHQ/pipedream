import app from "../../proxy_spider.app.mjs";

export default {
  key: "proxy_spider-ping-server",
  name: "Ping Server",
  description: "Ping Proxy Spider. [See the documentation](https://proxy-spider.com/docs/api/public-proxies)",
  version: "0.0.1",
  annotations: {
    openWorldHint: true,
    destructiveHint: false,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
  },
  async run({ $ }) {
    const response = await this.app.pingServer({
      $,
    });
    $.export("$summary", "Successfully sent the request. Status: " + response.status);
    return response;
  },
};
