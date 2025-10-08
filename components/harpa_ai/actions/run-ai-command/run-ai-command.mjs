import harpaAi from "../../harpa_ai.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "harpa_ai-run-ai-command",
  name: "Run AI Command",
  description: "Run an AI command. [See the documentation](https://harpa.ai/grid/grid-rest-api-reference#run-ai-command)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    harpaAi,
    url: {
      type: "string",
      label: "URL",
      description: "the page to run the AI command over",
    },
    name: {
      type: "string",
      label: "Name",
      description: "A command name to execute such as Summary",
      optional: true,
    },
    inputs: {
      type: "string[]",
      label: "Inputs",
      description: "An array of Strings, each one passed down into command in place of the user input. Inputs are used to bypass waiting for the user input in multi-step commands. For example [ \"REPORT\", \"DONE\" ] for the Summary command.",
      optional: true,
    },
    resultParam: {
      type: "string",
      label: "Result Param",
      description: "A HARPA {{parameter}} to interpret as the command result. By default is set to \"message\" to take the last chat message. Supports dot notation, e.g. \"g.data.email\". Refer to [AI Commands Guide](https://harpa.ai/chatml/overview) for more details.",
      optional: true,
    },
    node: {
      propDefinition: [
        harpaAi,
        "node",
      ],
    },
    timeout: {
      propDefinition: [
        harpaAi,
        "timeout",
      ],
    },
    resultsWebhook: {
      propDefinition: [
        harpaAi,
        "resultsWebhook",
      ],
    },
    connection: {
      type: "string",
      label: "Connection",
      description: "The title or ID of AI connection to use for AI actions. If not specified or connection not found, default connection is used.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.harpaAi.sendAction({
      $,
      data: {
        action: "command",
        url: this.url,
        name: this.name,
        inputs: parseObject(this.inputs),
        resultParam: this.resultParam,
        node: this.node,
        timeout: this.timeout,
        resultsWebhook: this.resultsWebhook,
        connection: this.connection,
      },
    });
    $.export("$summary", `Ran AI command on ${this.url}`);
    return response;
  },
};
