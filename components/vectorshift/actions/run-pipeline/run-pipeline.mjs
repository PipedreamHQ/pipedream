import { ConfigurationError } from "@pipedream/platform";
import { parseObject } from "../../common/utils.mjs";
import vectorshift from "../../vectorshift.app.mjs";

export default {
  key: "vectorshift-run-pipeline",
  name: "Run Pipeline",
  description: "Executes a VectorShift pipeline with specified inputs. [See the documentation](https://docs.vectorshift.ai/api-reference/pipelines/run)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    vectorshift,
    pipelineId: {
      propDefinition: [
        vectorshift,
        "pipelineId",
      ],
    },
    inputs: {
      type: "object",
      label: "Pipeline Inputs",
      description: "Inputs for the pipeline execution. [See the documentation](https://docs.vectorshift.ai/platform/pipelines/general/input) for further details",
      optional: true,
    },
  },
  async run({ $ }) {
    try {
      const response = await this.vectorshift.executePipeline({
        $,
        pipelineId: this.pipelineId,
        data: {
          inputs: parseObject(this.inputs),
        },
      });
      $.export("$summary", `Pipeline executed successfully. Run ID: ${response.run_id}`);
      return response;
    } catch ({ message }) {
      const parsedError = JSON.parse(message).error;
      throw new ConfigurationError(parsedError);
    }
  },
};
