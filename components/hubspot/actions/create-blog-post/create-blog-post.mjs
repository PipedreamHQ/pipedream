import hubspot from "../../hubspot.app.mjs";
import commonBlogPostProp from "../common/common-blog-post-prop.mjs";

export default {
  key: "hubspot-create-blog-post",
  name: "Create Blog Post",
  description: "Creates a new blog post in HubSpot. [See the documentation](https://developers.hubspot.com/docs/api-reference/cms-posts-v3/basic/post-cms-v3-blogs-posts)",
  version: "0.0.3",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    hubspot,
    name: {
      type: "string",
      label: "Name",
      description: "The internal name of the blog post",
    },
    ...Object.fromEntries(Object.entries(commonBlogPostProp).map(([
      key,
      val,
    ]) => [
      key,
      {
        ...val,
        optional: false,
      },
    ])),
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

    const response = await this.hubspot.createBlogPost({
      $,
      data,
    });

    $.export("$summary", `Successfully created blog post with ID: ${response.id}`);
    return response;
  },
};
