import linkly from "../../linkly.app.mjs";

export default {
  key: "linkly-delete-link",
  name: "Delete Link",
  description: "Permanently delete a short link via `DELETE /api/v1/workspace/{workspace_id}/links/{id}`. The short URL will return 404 for new visitors. [See the documentation](https://app.linklyhq.com/swaggerui#/Links/deleteLink).",
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
