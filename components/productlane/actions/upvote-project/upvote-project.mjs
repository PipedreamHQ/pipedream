import productlane from "../../productlane.app.mjs";

export default {
  key: "productlane-upvote-project",
  name: "Upvote Project",
  description: "Upvotes a project by ID. [See the documentation](https://productlane.com/docs/api-reference/portal/upvote-project)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    productlane,
    projectId: {
      propDefinition: [
        productlane,
        "projectId",
      ],
    },
    email: {
      propDefinition: [
        productlane,
        "email",
      ],
      description: "The email associated with the upvote",
    },
  },
  async run({ $ }) {
    const response = await this.productlane.upvoteProject({
      $,
      projectId: this.projectId,
      data: {
        email: this.email,
      },
    });
    $.export("$summary", "Successfully upvoted project");
    return response;
  },
};
