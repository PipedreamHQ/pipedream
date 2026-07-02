import linkly from "../../linkly.app.mjs";

export default {
  key: "linkly-create-link",
  name: "Create Link",
  description: "Create a new short link via `POST /api/v1/link`. [See the documentation](https://app.linklyhq.com/swaggerui#/Links/createOrUpdateLink).",
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
    const response = await this.linkly.createLink({
      data: {
        url: this.url,
        workspace_id: this.linkly.workspaceId(),
        name: this.name,
        domain: this.domain,
        slug: this.slug,
      },
      $,
    });
    $.export("$summary", `Successfully created Linkly link for URL ${this.url}.`);
    return response;
  },
};
