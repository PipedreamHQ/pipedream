import linkly from "../../linkly.app.mjs";

export default {
  key: "linkly-update-link",
  name: "Update Link",
  description: "Update an existing short link via `POST /api/v1/link` (with `id`) — change its destination URL, slug, name, or custom domain without breaking the existing short URL. [See the documentation](https://app.linklyhq.com/swaggerui#/Links/createOrUpdateLink).",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
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
    url: {
      propDefinition: [
        linkly,
        "url",
      ],
      description: "New destination URL for the link (leave empty to keep the current value).",
      optional: true,
    },
    name: {
      propDefinition: [
        linkly,
        "name",
      ],
    },
    domain: {
      propDefinition: [
        linkly,
        "domain",
      ],
    },
    slug: {
      propDefinition: [
        linkly,
        "slug",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.linkly.updateLink({
      linkId: this.linkId,
      data: {
        workspace_id: this.linkly.workspaceId(),
        url: this.url,
        name: this.name,
        domain: this.domain,
        slug: this.slug,
      },
      $,
    });
    $.export("$summary", `Successfully updated link ${this.linkId}.`);
    return response;
  },
};
