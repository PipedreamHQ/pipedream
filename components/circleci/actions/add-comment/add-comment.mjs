import circleci from "../../circleci.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "circleci-add-comment",
  name: "Add Comment",
  description: "Adds a comment to an existing item. [See the documentation]().",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    circleci,
    itemId: {
      propDefinition: [
        circleci,
        "itemId",
      ],
    },
    commentContent: {
      propDefinition: [
        circleci,
        "commentContent",
      ],
    },
    userDetails: {
      propDefinition: [
        circleci,
        "userDetails",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.circleci.addComment({
      itemId: this.itemId,
      commentContent: this.commentContent,
      userDetails: this.userDetails,
    });
    $.export("$summary", `Added comment to item ${this.itemId}`);
    return response;
  },
};
