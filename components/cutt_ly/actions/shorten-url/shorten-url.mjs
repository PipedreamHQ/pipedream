import cuttLy from "../../cutt_ly.app.mjs";

export default {
  key: "cutt_ly-shorten-url",
  name: "Shorten URL",
  description: "Returns a shortened URL when given a target URL as a prop. [See the documentation](https://cutt.ly/cuttly-api)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    cuttLy,
    targetUrl: {
      propDefinition: [
        cuttLy,
        "targetUrl",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.cuttLy.shortenUrl({
      targetUrl: this.targetUrl,
    });
    $.export("$summary", `Successfully shortened URL to ${response.shortenedUrl}`);
    return response;
  },
};
