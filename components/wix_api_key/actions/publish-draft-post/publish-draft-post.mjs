import wix from "../../wix_api_key.app.mjs";

export default {
  key: "wix_api_key-publish-draft-post",
  name: "Publish Draft Post",
  description: "Publish a draft blog post [See the documentation](https://dev.wix.com/docs/rest/business-solutions/blog/draft-posts/publish-draft-post)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    wix,
    alert: {
      type: "alert",
      alertType: "info",
      content: "Note: You must have 'Blog' installed in your Wix website or this will return an error.",
    },
    site: {
      propDefinition: [
        wix,
        "site",
      ],
    },
    draftPostId: {
      propDefinition: [
        wix,
        "draftPostId",
        (c) => ({
          siteId: c.site,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.wix.publishDraftPost({
      $,
      siteId: this.site,
      postId: this.draftPostId,
    });

    $.export("$summary", `Successfully published draft post ${this.draftPostId}`);
    return response;
  },
};
