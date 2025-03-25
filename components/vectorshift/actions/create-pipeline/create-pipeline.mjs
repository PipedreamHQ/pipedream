import vectorshift from "../../vectorshift.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "vectorshift-create-pipeline",
  name: "Create Pipeline",
  description: "Creates a new pipeline in VectorShift. [See the documentation](https://docs.vectorshift.ai)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    vectorshift: {
      type: "app",
      app: "vectorshift",
    },
    name: {
      propDefinition: [
        "vectorshift",
        "name",
      ],
    },
    config: {
      propDefinition: [
        "vectorshift",
        "config",
      ],
    },
    description: {
      propDefinition: [
        "vectorshift",
        "description",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const pipelineId = await this.vectorshift.createPipeline({
      name: this.name,
      config: this.config,
      description: this.description,
    });

    $.export("$summary", `Created pipeline with ID ${pipelineId}`);
    return {
      id: pipelineId,
    };
  },
};
