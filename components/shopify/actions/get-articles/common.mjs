import utils from "../../common/utils.mjs";

export default {
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
