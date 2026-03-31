import { LANGUAGE_OPTIONS } from "../../common/constants.mjs";
import hubspot from "../../hubspot.app.mjs";

export default {
  language: {
    type: "string",
    label: "Language",
    description: "The language of the blog post",
    options: LANGUAGE_OPTIONS,
    optional: true,
  },
  slug: {
    type: "string",
    label: "Slug",
    description: "The URL slug of the blog post",
    optional: true,
  },
  metaDescription: {
    type: "string",
    label: "Meta Description",
    description: "The meta description of the blog post",
    optional: true,
  },
  postBody: {
    type: "string",
    label: "Post Body",
    description: "The HTML content of the blog post",
    optional: true,
  },
  postSummary: {
    type: "string",
    label: "Post Summary",
    description: "A summary of the blog post",
    optional: true,
  },
  htmlTitle: {
    type: "string",
    label: "HTML Title",
    description: "The HTML title tag for the blog post",
    optional: true,
  },
  featuredImage: {
    type: "string",
    label: "Featured Image",
    description: "The URL of the featured image for the blog post",
    optional: true,
  },
  featuredImageAltText: {
    type: "string",
    label: "Featured Image Alt Text",
    description: "The alt text for the featured image",
    optional: true,
  },
  useFeaturedImage: {
    type: "boolean",
    label: "Use Featured Image",
    description: "Whether to use a featured image for the blog post",
    optional: true,
  },
  authorName: {
    type: "string",
    label: "Author Name",
    description: "The name of the blog post author",
    optional: true,
  },
  blogAuthorId: {
    propDefinition: [
      hubspot,
      "blogAuthorId",
    ],
    optional: true,
  },
  contentGroupId: {
    propDefinition: [
      hubspot,
      "blogId",
    ],
    optional: true,
  },
  publishDate: {
    type: "string",
    label: "Publish Date",
    description: "The publish date for the blog post. Format: YYYY-MM-DDTHH:MM:SSZ",
    optional: true,
  },
  headHtml: {
    type: "string",
    label: "Head HTML",
    description: "Custom HTML to be added to the head section",
    optional: true,
  },
  footerHtml: {
    type: "string",
    label: "Footer HTML",
    description: "Custom HTML to be added to the footer section",
    optional: true,
  },
  enableGoogleAmpOutputOverride: {
    type: "boolean",
    label: "Enable Google AMP Output Override",
    description: "Override the AMP settings for this specific post",
    optional: true,
  },
  password: {
    type: "string",
    label: "Password",
    description: "Password required to view the blog post",
    optional: true,
  },
};
