import confluence from "../../confluence.app.mjs";

export default {
  key: "confluence-create-post",
  name: "Create Post",
  description: "Creates a new page or blog post on Confluence. [See the documentation](https://developer.atlassian.com/cloud/confluence/rest/v1/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    confluence,
    postType: {
      propDefinition: [
        confluence,
        "postType",
      ],
    },
    title: {
      propDefinition: [
        confluence,
        "title",
      ],
    },
    content: {
      propDefinition: [
        confluence,
        "content",
      ],
    },
    space: {
      propDefinition: [
        confluence,
        "spaceKey",
      ],
      optional: true,
    },
    parentPage: {
      propDefinition: [
        confluence,
        "parentPage",
      ],
      optional: true,
    },
    labels: {
      propDefinition: [
        confluence,
        "labels",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      postType, title, content, space, parentPage, labels,
    } = this;
    const response = await this.confluence.createPost({
      postType,
      title,
      content,
      space,
      parentPage,
      labels,
    });
    $.export("$summary", `Successfully created ${postType} with ID: ${response.id}`);
    return response;
  },
};
