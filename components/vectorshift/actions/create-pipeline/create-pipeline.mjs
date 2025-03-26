import { ConfigurationError } from "@pipedream/platform";
import { parseObject } from "../../common/utils.mjs";
import vectorshift from "../../vectorshift.app.mjs";

export default {
  key: "vectorshift-create-pipeline",
  name: "Create Pipeline",
  description: "Creates a new pipeline in VectorShift. [See the documentation](https://docs.vectorshift.ai)",
  version: "0.0.1",
  type: "action",
  props: {
    vectorshift,
    name: {
      type: "string",
      label: "Pipeline Name",
      description: "Name of the new pipeline",
    },
    config: {
      type: "object",
      label: "Pipeline Config",
      description: "Configuration for the new pipeline",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Optional description of the new pipeline",
      optional: true,
    },
  },
  async run({ $ }) {
    try {
      const response = await this.vectorshift.createPipeline({
        $,
        data: {
          name: this.name,
          config: parseObject(this.config),
          description: this.description,
        },
      });

      $.export("$summary", `Created pipeline with ID ${response.id}`);
      return response;
    } catch ({ message }) {
      const parsedError = JSON.parse(message).error;
      throw new ConfigurationError(parsedError);
    }
  },
};
