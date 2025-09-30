import { sleep } from "../../common/utils.mjs";
import relevanceAI from "../../relevance_ai.app.mjs";

export default {
  key: "relevance_ai-run-tool",
  name: "Run Tool",
  description: "Executes a specific tool within Relevance AI and waits for a response for up to 60 seconds. [See the documentation](https://relevanceai.com/docs/build-custom-tools/create-a-tool)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    relevanceAI,
    toolId: {
      propDefinition: [
        relevanceAI,
        "toolId",
      ],
    },
    parameters: {
      type: "object",
      label: "Parameters",
      description: "The parameters for the tool execution.",
    },
    timeout: {
      type: "integer",
      label: "Timeout",
      description: "The time to wait for a response from the tool execution, in seconds.",
      default: 60,
      max: 60,
      min: 1,
    },
  },
  async run({ $ }) {
    const response = await this.relevanceAI.executeTool({
      $,
      toolId: this.toolId,
      data: {
        params: this.parameters,
      },
    });

    const jobId = response.job_id;
    let toolOutput = {};
    let cont = true;
    let timeLimit = 0;

    do {
      timeLimit += 5;
      await sleep(5000);
      const jobStatus = await this.relevanceAI.getJobStatus({
        $,
        jobId,
        toolId: this.toolId,
      });
      if (jobStatus.type === "complete") {
        toolOutput = jobStatus.updates[0].output.output;
        cont = false;
      }
    } while (cont && (timeLimit <= this.timeout));

    $.export("$summary", `Successfully executed tool with ID ${this.toolId}`);
    return toolOutput;
  },
};
