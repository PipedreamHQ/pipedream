import manychat from "../../manychat.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "manychat-add-tag-user",
  name: "Add Tag to User",
  description: "Adds a specific tag to a user specified by their user ID. This action is essential to categorize and filter users based on business-specific parameters. [See the documentation](https://api.manychat.com)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    manychat,
    userId: {
      propDefinition: [
        manychat,
        "userId",
      ],
    },
    tag: {
      propDefinition: [
        manychat,
        "tag",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.manychat.addTag({
      userId: this.userId,
      tag: this.tag,
    });

    $.export("$summary", `Successfully added tag "${this.tag}" to user with ID ${this.userId}`);
    return response;
  },
};
