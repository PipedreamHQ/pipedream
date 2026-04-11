import pubrio from "../../pubrio.app.mjs";

export default {
  key: "pubrio-get-news-galleries",
  name: "Get News Galleries",
  description: "Get available news gallery codes for filtering. [See the documentation](https://docs.pubrio.com)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    openWorldHint: true,
  },
  props: {
    pubrio,
  },
  async run({ $ }) {
    const response = await this.pubrio.getNewsGalleries({
      $,
    });
    $.export("$summary", "Successfully retrieved news galleries");
    return response;
  },
};
