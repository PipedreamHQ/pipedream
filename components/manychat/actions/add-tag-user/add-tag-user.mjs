import manychat from "../../manychat.app.mjs";

export default {
  key: "manychat-add-tag-user",
  name: "Add Tag to User",
  description: "Adds a specific tag to a user specified by their user ID. This action is essential to categorize and filter users based on business-specific parameters. [See the documentation](https://api.manychat.com)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    manychat,
    userId: {
      propDefinition: [
        manychat,
        "userId",
      ],
    },
    tagId: {
      propDefinition: [
        manychat,
        "tagId",
      ],
      withLabel: true,
    },
  },
  async run({ $ }) {
    const response = await this.manychat.addTag({
      data: {
        subscriber_id: this.userId,
        tag_id: this.tagId.value,
      },
    });

    $.export("$summary", `Successfully added tag "${this.tagId.label}" to user with ID: ${this.userId}`);
    return response;
  },
};
