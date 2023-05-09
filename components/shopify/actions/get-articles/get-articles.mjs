import app from "../../common/rest-admin.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "shopify-get-articles",
  name: "Get Articles",
  description: "Retrieve a list of all articles from a blog. [See The Documentation](https://shopify.dev/docs/api/admin-rest/2023-04/resources/article#get-blogs-blog-id-articles)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    blogId: {
      propDefinition: [
        app,
        "blogId",
      ],
    },
  },
  async run({ $: step }) {
    const stream = this.app.getResourcesStream({
      resourceFn: this.app.listBlogArticles,
      resourceFnArgs: {
        step,
        blogId: this.blogId,
      },
      resourceName: "articles",
    });

    const articles = await utils.streamIterator(stream);

    step.export("$summary", `Successfully retrieved ${articles.length} article(s).`);

    return articles;
  },
};
