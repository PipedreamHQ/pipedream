// legacy_hash_id: a_Xzi2jX

import { axios } from "@pipedream/platform";

export default {
  key: "medium-create-post",
  name: "Create a post",
  version: "0.1.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Create a new Medium post.",
  type: "action",
  props: {
    medium: {
      type: "app",
      app: "medium",
    },
    title: {
      type: "string",
      description: "The title of the post. Note that this title is used for SEO and when rendering the post as a listing, but will not appear in the actual post for that, the title must be specified in the content field as well. Titles longer than 100 characters will be ignored. In that case, a title will be synthesized from the first content in the post when it is published.",
    },
    contentFormat: {
      type: "string",
      description: "The format of the \"content\" field. There are two valid values, \"html\", and \"markdown\"",
      options: [
        "html",
        "markdown",
      ],
    },
    content: {
      type: "string",
      description: "The body of the post, in a valid, semantic, HTML fragment, or Markdown. Further markups may be supported in the future. For a full list of accepted HTML tags, see here. If you want your title to appear on the post page, you must also include it as part of the post content.",
    },
    tags: {
      type: "any",
      description: "Tags to classify the post. Only the first three will be used. Tags longer than 25 characters will be ignored.",
      optional: true,
    },
    canonicalUrl: {
      type: "string",
      description: "The original home of this content, if it was originally published elsewhere.",
      optional: true,
    },
    publishStatus: {
      type: "string",
      description: "The status of the post. Valid values are 'public', 'draft', or 'unlisted'. The default is 'public'.",
      optional: true,
      options: [
        "public",
        "draft",
        "unlisted",
      ],
    },
    license: {
      type: "string",
      description: "The license of the post. Valid values are 'all-rights-reserved', 'cc-40-by', 'cc-40-by-sa', 'cc-40-by-nd', 'cc-40-by-nc', 'cc-40-by-nc-nd', 'cc-40-by-nc-sa', 'cc-40-zero', 'public-domain'. The default is 'all-rights-reserved'.",
      optional: true,
      options: [
        "all-rights-reserved",
        "cc-40-by",
        "cc-40-by-sa",
        "cc-40-by-nd",
        "cc-40-by-nc-nd",
        "cc-40-by-nc-sa",
        "cc-40-zero",
        "public-domain",
      ],
    },
    notifyFollowers: {
      type: "boolean",
      description: "Whether to notifyFollowers that the user has published.",
      optional: true,
    },
  },
  async run({ $ }) {
    return await axios($, {
      method: "post",
      url: `https://api.medium.com/v1/users/${this.medium.$auth.oauth_uid}/posts`,
      headers: {
        Authorization: `Bearer ${this.medium.$auth.oauth_access_token}`,
      },
      data: {
        title: this.title,
        contentFormat: this.contentFormat,
        content: this.content,
        tags: this.tags,
        canonicalUrl: this.canonicalUrl,
        publishStatus: this.publishStatus,
        license: this.license,
        notifyFollowers: this.notifyFollowers,
      },
    });
  },
};
