import parma from "../../parma.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "parma-find-relationship",
  name: "Find Relationship",
  description: "Searches for an existing relationship in Parma. [See the documentation](https://developers.parma.ai/api-docs/index.html)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    parma,
    relationshipId: {
      propDefinition: [
        parma,
        "relationshipId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.parma.getRelationship({
      relationshipId: this.relationshipId,
    });
    $.export("$summary", `Successfully fetched relationship details for ID ${this.relationshipId}`);
    return response;
  },
};
