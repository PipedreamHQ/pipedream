import ghostAdminApi from "../../ghost_org_admin_api.app.mjs";

export default {
  key: "ghost_org_admin_api-create-post",
  name: "Create post",
  description: "Create a post. [See the documentation](https://ghost.org/docs/admin-api/#creating-a-post).",
  type: "action",
  version: "0.0.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
    featured: {
      type: "boolean",
      label: "Featured",
      description: "Set to `true` to make the post featured",
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
      featured,
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
            featured,
          },
        ],
      },
    });

    $.export("$summary", `Succesfully created post with ID ${response.posts[0].id}`);

    return response;
  },
};
