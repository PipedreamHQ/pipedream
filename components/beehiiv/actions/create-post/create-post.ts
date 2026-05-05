// vandelay-test-dr
import app from "../../app/beehiiv.app";
import { defineAction } from "@pipedream/types";

export default defineAction({
  key: "beehiiv-create-post",
  name: "Create Post",
  description:
    "Create a new post (newsletter draft)."
    + " Pass HTML content in the `content` parameter."
    + " The post is created as a draft by default — set"
    + " `status: \"confirmed\"` to publish immediately."
    + " Use content tags to categorize the post."
    + " Use **Get Publication Info** to get the publication ID."
    + " [See the documentation]"
    + "(https://developers.beehiiv.com/api-reference/"
    + "posts/create)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    publicationId: {
      type: "string",
      label: "Publication ID",
      description:
        "The publication ID. Use **Get Publication Info** to find"
        + " this.",
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title of the post.",
    },
    subtitle: {
      type: "string",
      label: "Subtitle",
      description: "The subtitle/preview text of the post.",
      optional: true,
    },
    content: {
      type: "string",
      label: "Content",
      description:
        "The HTML content of the post body."
        + " Example: `<p>Hello subscribers!</p>`.",
    },
    slug: {
      type: "string",
      label: "Slug",
      description:
        "URL slug for the post. Auto-generated from title if"
        + " omitted.",
      optional: true,
    },
    authors: {
      type: "string[]",
      label: "Authors",
      description: "Author names for the post.",
      optional: true,
    },
    contentTags: {
      type: "string[]",
      label: "Content Tags",
      description: "Tags to categorize the post.",
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description:
        "Post status. `draft` (default) or `confirmed`"
        + " (published).",
      optional: true,
      options: [
        "draft",
        "confirmed",
      ],
    },
  },
  async run({ $ }) {
    const data: Record<string, unknown> = {
      title: this.title,
      content_html: this.content,
    };

    if (this.subtitle) data.subtitle = this.subtitle;
    if (this.slug) data.slug = this.slug;
    if (this.authors?.length) data.authors = this.authors;
    if (this.contentTags?.length) {
      data.content_tags = this.contentTags;
    }
    if (this.status) data.status = this.status;

    const response = await this.app.createPost(
      $,
      this.publicationId,
      data,
    );

    const post = response.data || response;
    const id = post.id || "unknown";

    $.export(
      "$summary",
      `Created post "${this.title}" (ID: ${id})`,
    );

    return response;
  },
});
