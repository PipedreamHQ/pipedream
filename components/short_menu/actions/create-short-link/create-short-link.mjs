import shortMenu from "../../short_menu.app.mjs";

export default {
  key: "short_menu-create-short-link",
  name: "Create Short Link",
  description: "Create a new short link. [See the documentation](https://docs.shortmenu.com/api-reference/endpoint/create-link)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    shortMenu,
    destinationUrl: {
      type: "string",
      label: "Destination URL",
      description: "Destination URL of the new short link. Must be a valid URL starting with a scheme such as `https`.",
    },
    slug: {
      type: "string",
      label: "Slug",
      description: "Optional slug for the new short link. If empty, a random slug will be generated. Must be unique within the domain.",
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Tags to assign to the new short link",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.shortMenu.createShortLink({
      $,
      data: {
        destinationUrl: this.destinationUrl,
        domain: this.shortMenu.$auth.custom_domain,
        slug: this.slug,
        tags: this.tags?.map((tag) => ({
          name: tag,
        })) || [],
      },
    });

    $.export("$summary", `Successfully created short link ${response.shortUrl}`);
    return response;
  },
};
