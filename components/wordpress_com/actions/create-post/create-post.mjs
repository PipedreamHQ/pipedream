import wordpress from "../../wordpress_com.app.mjs";

export default {
  key: "wordpress_com-create-post",
  name: "Create New Post",
  description: "Creates a new post on a WordPress.com site. [See the documentation](https://developer.wordpress.com/docs/api/1.1/post/sites/%24site/posts/new/)",
  version: "0.0.6",
  type: "action",
  props: {
    wordpress,
    site: {
      propDefinition: [
        wordpress,
        "siteId",
      ],
    },
    title: {
      type: "string",
      label: "Post Title",
      description: "The title of the post",
    },
    content: {
      type: "string",
      label: "Post Content",
      description: "The content of the post (HTML or text)",
    },
    status: {
      type: "string",
      label: "Status",
      description: "The status of the post",
      options: [
        "publish",
        "draft",
        "private",
        "pending",
      ],
      default: "draft",
      optional: true,
    },
    type: {
      type: "string",
      label: "Post Type",
      description: "The type of the post (post or page). For attachments, use the 'Upload Media' action.",
      options: [
        {
          label: "Post",
          value: "post",
        },
        {
          label: "Page",
          value: "page",
        },
      ],
      default: "post",
      optional: true,
    },
  },
  async run({ $ }) {
    const warnings = [];

    const {
      site,
      wordpress,
      ...fields
    } =  this;

    warnings.push(...wordpress.checkDomainOrId(site));

    let response;

    try {
      response = await wordpress.createWordpressPost({
        $,
        site,
        data: {
          ...fields,
        },
      });
    } catch (error) {
      wordpress.throwCustomError("Could not create post", error, warnings);
    };

    $.export("$summary",
      `Post “${this.title}” is successfully created with ID “${response?.ID}”` +
       "\n- "  + warnings.join("\n- "));
  },
};

