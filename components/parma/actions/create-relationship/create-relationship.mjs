import parma from "../../parma.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "parma-create-relationship",
  name: "Create Relationship",
  description: "Creates a new relationship in Parma. [See the documentation](https://developers.parma.ai/api-docs/index.html)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    parma,
    source: {
      propDefinition: [
        parma,
        "source",
      ],
    },
    target: {
      propDefinition: [
        parma,
        "target",
      ],
    },
    type: {
      propDefinition: [
        parma,
        "type",
      ],
    },
    metadata: {
      propDefinition: [
        parma,
        "metadata",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.parma.createRelationship({
      source: this.source,
      target: this.target,
      type: this.type,
      metadata: this.metadata,
    });

    $.export("$summary", `Successfully created relationship of type ${this.type} with source ${this.source} and target ${this.target}`);
    return response;
  },
};
