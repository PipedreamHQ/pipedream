import vectorshift from "../../vectorshift.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "vectorshift-run-pipeline",
  name: "Run Pipeline",
  description: "Executes a VectorShift pipeline with specified inputs. [See the documentation](https://docs.vectorshift.ai/api-reference/pipelines/run)",
  version: "0.0.{{ts}}",
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
      type: "string",
      label: "Pipeline Inputs",
      description: "Inputs for the pipeline execution as a JSON string",
    },
  },
  async run({ $ }) {
    const runId = await this.vectorshift.executePipeline({
      pipelineId: this.pipelineId,
      inputs: this.inputs,
    });
    $.export("$summary", `Pipeline executed successfully. Run ID: ${runId}`);
    return {
      run_id: runId,
    };
  },
};
