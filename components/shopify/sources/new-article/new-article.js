const shopify = require("../../shopify.app.js");

module.exports = {
	key: "shopify-new-article",
	name: "New Article",
	description: "Emits an event for each new article in a blog.",
	version: "0.0.4",
	props: {
		db: "$.service.db",
		timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
		shopify,
		blogIds: {
			type: "string[]",
			label: "Blogs",
			async options() {
				const blogs = await this.shopify.getBlogs();
				return blogs.map((blog) => {
          return { label: blog.title, value: blog.id };
        });
			}
		}
	},
	async run() {
		for (const blog_id of this.blogIds) {
			let since_id = this.db.get(blog_id) || null;
  		let results = await this.shopify.getArticles(blog_id, since_id);
  		for (const article of results) {
  			this.$emit(article, {
      		id: article.id,
      		summary: article.title,
      		ts: Date.now(),
    		});
  		}
  		if (results[results.length-1])
    		this.db.set(blog_id, results[results.length-1].id);
    }
	},
};