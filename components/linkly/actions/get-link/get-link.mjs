import linkly from "../../linkly.app.mjs";

export default {
  key: "linkly-get-link",
  name: "Get Link",
  description: "Fetch a single short link via `GET /api/v1/link/{id}`, with full metadata including click counts, custom domain, and redirect rules. [See the documentation](https://app.linklyhq.com/swaggerui#/Links/getLink).",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
    const response = await this.linkly.getLink({
      linkId: this.linkId,
      $,
    });
    $.export("$summary", `Successfully fetched link with ID: ${this.linkId}`);
    return response;
  },
};
