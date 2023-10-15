import productlane from "../../productlane.app.mjs";

export default {
  key: "productlane-upvote-project",
  name: "Upvote Project",
  description: "Upvotes a project by ID. [See the documentation](https://docs.productlane.com/api-reference/portal/upvote-project)",
  version: "0.0.1",
  type: "action",
  props: {
    productlane,
    projectId: {
      propDefinition: [
        productlane,
        "projectId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.productlane.upvoteProject({
      projectId: this.projectId,
    });
    $.export("$summary", `Successfully upvoted project with ID: ${this.projectId}`);
    return response;
  },
};
