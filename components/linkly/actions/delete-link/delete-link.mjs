import linkly from "../../linkly.app.mjs";

export default {
  key: "linkly-delete-link",
  name: "Delete Link",
  description: "Permanently deletes a short link via the [Linkly URL Shortener API](https://linklyhq.com). The short URL will return 404 for new visitors. [See the documentation](https://linklyhq.com/url-shortener-api).",
  version: "0.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    linkly,
    linkId: {
      propDefinition: [
        linkly,
        "linkId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.linkly.deleteLink({
      linkId: this.linkId,
      $,
    });
    $.export("$summary", `Successfully deleted link ${this.linkId}.`);
    return response;
  },
};
