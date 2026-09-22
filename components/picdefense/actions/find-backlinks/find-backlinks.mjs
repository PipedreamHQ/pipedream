import picdefense from "../../picdefense.app.mjs";

export default {
  key: "picdefense-find-backlinks",
  name: "Find Backlinks",
  description: "Returns a list of URLs where the image appears. [See the documentation](https://app.picdefense.io/apidocs/)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    picdefense,
    url: {
      propDefinition: [
        picdefense,
        "url",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.picdefense.findBacklinks({
      $,
      data: {
        url: this.url,
      },
    });

    $.export("$summary", `Found ${response.data?.backlinks?.urls?.length || 0} backlinks for the URL: ${this.url}`);

    return response;
  },
};
