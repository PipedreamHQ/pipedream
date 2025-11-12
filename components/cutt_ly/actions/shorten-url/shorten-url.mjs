import cuttLy from "../../cutt_ly.app.mjs";

export default {
  key: "cutt_ly-shorten-url",
  name: "Shorten URL",
  description: "Returns a shortened URL when given a target URL as a prop. [See the documentation](https://cutt.ly/cuttly-api)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    cuttLy,
    targetUrl: {
      type: "string",
      label: "Target URL",
      description: "The URL you want to shorten",
    },
  },
  async run({ $ }) {
    const response = await this.cuttLy.callApi({
      params: {
        short: this.targetUrl,
      },
      $,
    });
    $.export("$summary", `Successfully shortened URL to ${response.url.shortLink}.`);
    return response;
  },
};
