import confluence from "../../confluence.app.mjs";

export default {
  key: "confluence-create-post",
  name: "Create Post",
  description: "Creates a new page or blog post on Confluence. [See the documentation](https://developer.atlassian.com/cloud/confluence/rest/v2/api-group-blog-post/#api-blogposts-post)",
  version: "0.0.7",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    confluence,
    spaceId: {
      propDefinition: [
        confluence,
        "spaceId",
      ],
    },
    title: {
      propDefinition: [
        confluence,
        "title",
      ],
    },
    body: {
      propDefinition: [
        confluence,
        "body",
      ],
    },
    status: {
      propDefinition: [
        confluence,
        "status",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.confluence.createPost({
      $,
      cloudId: await this.confluence.getCloudId({
        $,
      }),
      data: {
        spaceId: this.spaceId,
        status: this.status,
        title: this.title,
        body: {
          representation: "storage",
          value: this.body,
        },
      },
    });
    $.export("$summary", `Successfully created post with ID: ${response.id}`);
    return response;
  },
};
