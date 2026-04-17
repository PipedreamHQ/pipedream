import hubspot from "../../hubspot.app.mjs";
import commonBlogPostProp from "../common/common-blog-post-prop.mjs";

export default {
  key: "hubspot-update-blog-post-draft",
  name: "Update Blog Post Draft",
  description: "Updates the draft version of an existing blog post in HubSpot. [See the documentation](https://developers.hubspot.com/docs/api-reference/cms-posts-v3/basic/patch-cms-v3-blogs-posts-objectId-draft)",
  version: "0.0.3",
  type: "action",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    hubspot,
    blogPostId: {
      propDefinition: [
        hubspot,
        "blogPostId",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "The internal name of the blog post",
      optional: true,
    },
    ...commonBlogPostProp,
  },
  async run({ $ }) {
    const data = {
      name: this.name,
      language: this.language,
      slug: this.slug,
      metaDescription: this.metaDescription,
      postBody: this.postBody,
      postSummary: this.postSummary,
      htmlTitle: this.htmlTitle,
      featuredImage: this.featuredImage,
      featuredImageAltText: this.featuredImageAltText,
      useFeaturedImage: this.useFeaturedImage,
      authorName: this.authorName,
      blogAuthorId: this.blogAuthorId,
      contentGroupId: this.contentGroupId,
      publishDate: this.publishDate,
      headHtml: this.headHtml,
      footerHtml: this.footerHtml,
      enableGoogleAmpOutputOverride: this.enableGoogleAmpOutputOverride,
      password: this.password,
    };

    Object.keys(data).forEach((key) => data[key] === undefined && delete data[key]);

    const response = await this.hubspot.updateBlogPostDraft({
      $,
      objectId: this.blogPostId,
      data,
    });

    $.export("$summary", `Successfully updated draft for blog post with ID: ${response.id}`);
    return response;
  },
};
