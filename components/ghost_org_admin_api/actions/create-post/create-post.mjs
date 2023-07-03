import ghostAdminApi from "../../ghost_org_admin_api.app.mjs";

export default {
  key: "ghost_org_admin_api-create-post",
  name: "Create post",
  description: "Create a post. [See the docs here](https://ghost.org/docs/admin-api/#creating-a-post).",
  type: "action",
  version: "0.0.3",
  props: {
    ghostAdminApi,
    title: {
      type: "string",
      label: "Title",
      description: "Title of the post",
    },
    featuredImage: {
      type: "string",
      label: "Featured Image",
      description: "URL of the featured image",
      optional: true,
    },
    html: {
      type: "string",
      label: "HTML",
      description: "HTML content of the post",
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "Status of the post",
      options: [
        "draft",
        "published",
      ],
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Tags of the post",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      title,
      featuredImage,
      html,
      status,
      tags,
    } = this;

    const response = await this.ghostAdminApi.createPost({
      $,
      params: {
        source: "html",
      },
      data: {
        posts: [
          {
            title,
            feature_image: featuredImage,
            html,
            status,
            tags,
          },
        ],
      },
    });

    $.export("$summary", `Succesfully created post with ID ${response.posts[0].id}`);

    return response;
  },
};
