import twin from "../../twin.app.mjs";

export default {
  key: "twin-browse",
  name: "Browse",
  description: "Browse the internet with an AI web navigation agent that can find information for you. [See the documentation](https://docs.twin.so/api-reference/endpoint/browse)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    twin,
    startUrl: {
      type: "string",
      label: "Start URL",
      description: "The URL where the browsing task should begin",
    },
    goal: {
      type: "string",
      label: "Goal",
      description: "The goal or objective of the browsing task. Example: \"Find the latest price of AAPL stock.\"",
    },
    outputType: {
      type: "string",
      label: "Output Type",
      description: "The type of output expected from the task",
      options: [
        "string",
        "url",
        "list[url]",
      ],
      default: "string",
      optional: true,
    },
    callbackWithRerun: {
      type: "boolean",
      label: "Callback With Rerun",
      description: "Use the `$.flow.rerun` Node.js helper to rerun the step when the search is completed. This will increase execution time and credit usage as a result. [See the documentation](https://pipedream.com/docs/code/nodejs/rerun/#flow-rerun). Not available in Pipedream Connect.",
      optional: true,
    },
  },
  async run({ $ }) {
    let response, completionCallbackUrl;
    const context = $.context;
    const run = context
      ? context.run
      : {
        runs: 1,
      };
    if (run.runs === 1) {
      if (context && this.callbackWithRerun) {
        ({ resume_url: completionCallbackUrl } = $.flow.rerun(600000, null, 1));
      }
      response = await this.twin.browse({
        $,
        data: {
          startUrl: this.startUrl,
          goal: this.goal,
          outputType: this.outputType,
          completionCallbackUrl,
        },
      });
    }

    if (run.callback_request) {
      const { task_id: taskId } = run.callback_request.body;
      response = await this.twin.getTask({
        taskId,
      });
    }

    if (response.status === "COMPLETED") {
      $.export("$summary", "Successfully completed browsing");
    }
    return response;
  },
};
