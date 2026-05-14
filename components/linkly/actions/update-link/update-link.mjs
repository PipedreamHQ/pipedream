import linkly from "../../linkly.app.mjs";

export default {
  key: "linkly-update-link",
  name: "Update Link",
  description: "Updates an existing short link via the [Linkly URL Shortener API](https://linklyhq.com) — change its destination URL, slug, name, or custom domain without breaking the existing short URL.",
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
      type: "string",
      label: "Destination URL",
      description: "New destination URL for the link",
      optional: true,
    },
    name: {
      propDefinition: [
        linkly,
        "name",
      ],
    },
    slug: {
      propDefinition: [
        linkly,
        "slug",
      ],
    },
    domainId: {
      propDefinition: [
        linkly,
        "domainId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.linkly.updateLink({
      linkId: this.linkId,
      data: {
        workspace_id: this.linkly.workspaceId(),
        ...(this.url && {
          url: this.url,
        }),
        ...(this.name && {
          name: this.name,
        }),
        ...(this.slug && {
          full_url: this.slug,
        }),
        ...(this.domainId && {
          domain_id: this.domainId,
        }),
      },
      $,
    });
    $.export("$summary", `Successfully updated link ${this.linkId}.`);
    return response;
  },
};
