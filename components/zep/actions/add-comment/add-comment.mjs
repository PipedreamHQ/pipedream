import zep from "../../zep.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "zep-add-comment",
  name: "Add Comment",
  description: "Adds a comment to an existing document in Zep. [See the documentation](https://help.getzep.com/api-reference)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    zep,
    documentId: {
      propDefinition: [
        zep,
        "documentId",
      ],
    },
    commentContent: {
      propDefinition: [
        zep,
        "commentContent",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.zep.addComment({
      documentId: this.documentId,
      commentContent: this.commentContent,
    });

    $.export("$summary", `Comment added to document ${this.documentId}`);
    return response;
  },
};
