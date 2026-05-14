import linkly from "../../linkly.app.mjs";

export default {
  key: "linkly-create-link",
  name: "Create Link",
  description: "Creates a new short link with the [Linkly URL Shortener API](https://linklyhq.com). [See the documentation](https://linklyhq.com/url-shortener-api).",
  version: "0.1.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    linkly,
    url: {
      propDefinition: [
        linkly,
        "url",
      ],
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
    const response = await this.linkly.createLink({
      data: {
        url: this.url,
        workspace_id: this.linkly.workspaceId(),
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
    $.export("$summary", `Successfully created Linkly link for URL ${this.url}.`);
    return response;
  },
};
