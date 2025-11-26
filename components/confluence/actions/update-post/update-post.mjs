import confluence from "../../confluence.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "confluence-update-post",
  name: "Update a Post",
  description: "Updates a page or blog post on Confluence by its ID. [See the documentation](https://developer.atlassian.com/cloud/confluence/rest/v2/api-group-blog-post/#api-blogposts-id-put)",
  version: "0.0.7",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    confluence,
    postId: {
      propDefinition: [
        confluence,
        "postId",
      ],
    },
    spaceId: {
      propDefinition: [
        confluence,
        "spaceId",
      ],
      optional: true,
    },
    status: {
      propDefinition: [
        confluence,
        "status",
      ],
    },
    title: {
      propDefinition: [
        confluence,
        "title",
      ],
      optional: true,
    },
    body: {
      propDefinition: [
        confluence,
        "body",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const cloudId = await this.confluence.getCloudId({
      $,
    });
    const post = await this.confluence.getPost({
      $,
      cloudId,
      postId: this.postId,
      params: {
        "body-format": "storage",
      },
    });
    if (!Object.keys(post.body).length && !this.body) {
      throw new ConfigurationError("Must contain Body");
    }
    const representation = Object.keys(post.body)[0];
    const value = post.body[representation].value;
    const version = post.version.number;
    const response = await this.confluence.updatePost({
      $,
      cloudId,
      postId: this.postId,
      data: {
        id: this.postId,
        status: this.status || post.status,
        title: this.title || post.title,
        body: {
          representation: this.body
            ? "storage"
            : representation,
          value: this.body || value,
        },
        version: {
          number: version + 1,
        },
      },
    });
    $.export("$summary", `Successfully updated post with ID: ${this.postId}`);
    return response;
  },
};
