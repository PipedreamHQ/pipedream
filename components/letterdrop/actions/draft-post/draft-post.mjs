import letterdrop from "../../letterdrop.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "letterdrop-draft-post",
  name: "Draft Blog Post",
  description: "Drafts a new blog post in your workspace with the required title and content, and optional images and tags. [See the documentation](https://docs.letterdrop.com/api)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    letterdrop,
    title: {
      propDefinition: [
        letterdrop,
        "title",
      ],
    },
    content: {
      propDefinition: [
        letterdrop,
        "content",
      ],
    },
    images: {
      propDefinition: [
        letterdrop,
        "images",
        (c) => ({
          previousPropValue: c.content,
        }), // Assuming content is a dependency for images
      ],
      optional: true,
    },
    tags: {
      propDefinition: [
        letterdrop,
        "tags",
        (c) => ({
          previousPropValue: c.content,
        }), // Assuming content is a dependency for tags
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.letterdrop.draftPost({
      title: this.title,
      content: this.content,
      images: this.images,
      tags: this.tags,
    });

    $.export("$summary", `Successfully drafted the blog post titled "${this.title}"`);
    return response;
  },
};
