import wordpress from "../../wordpress_com.app.mjs";

export default {
  key: "wordpress_com-delete-post",
  name: "Delete Post",
  description: "Deletes a post. [See the documentation](https://developer.wordpress.com/docs/api/1.1/post/sites/%24site/posts/%24post_ID/delete/)",
  version: "0.0.2",
  type: "action",
  props: {
    wordpress,
    site: {
      propDefinition: [
        wordpress,
        "siteId",
      ],
    },
    postId: {
      propDefinition: [
        wordpress,
        "postId",
        (c) => ({
          site: c.site,
        }),
      ],
      description: "The ID of the post you want to delete",
    },
  },
  async run({ $ }) {
    const warnings = [];

    const {
      site,
      wordpress,
      postId,
    } =  this;

    warnings.push(...wordpress.checkDomainOrId(site));

    let response;

    try {
      response = await wordpress.deleteWordpressPost({
        $,
        site,
        postId,
      });
    } catch (error) {
      wordpress.throwCustomError("Could not delete post", error, warnings);
    };

    $.export("$summary", `Post ID “${response?.ID}” has been successfully deleted` +
       "\n- "  + warnings.join("\n- "));
  },
};

