import cuttLy from "../../cutt_ly.app.mjs";

export default {
  key: "cutt_ly-update-source-url",
  name: "Update Source URL",
  description: "Changes the source URL of a previously shortened URL. Requires a Paid Subscription. [See the documentation](https://cutt.ly/cuttly-api)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    cuttLy,
    shortenedUrl: {
      type: "string",
      label: "Shortened URL",
      description: "The shortened URL to edit. Must already be registered.",
    },
    newSourceUrl: {
      type: "string",
      label: "New Source URL",
      description: "The new source URL to change a previously shortened URL",
    },
  },
  async run({ $ }) {
    const response = await this.cuttLy.callApi({
      params: {
        edit: this.shortenedUrl,
        source: this.newSourceUrl,
      },
      $,
    });
    $.export("$summary", `Successfully updated source URL for ${this.shortenedUrl}.`);
    return response;
  },
};
