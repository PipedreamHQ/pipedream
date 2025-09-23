import tokenMetrics from "../../token_metrics.app.mjs";
import { ENDPOINTS } from "../../common/constants.mjs";

const endpoint = ENDPOINTS.TOKEN_METRICS_AI;

export default {
  key: "token_metrics-get-token-metrics-ai",
  name: "Get Token Metrics AI",
  description: `${endpoint.description}. [See the documentation](https://developers.tokenmetrics.com/reference/tmai)`,
  version: "0.1.0",
  type: "action",
  props: {
    tokenMetrics,
    // Body parameter for POST request
    messages: {
      type: "string",
      label: "Messages",
      description: "JSON string containing the messages array for the AI chatbot. Example: `{\"messages\":[{\"user\":\"What is the next 100x coin ?\"}]}`",
      default: "{\"messages\":[{\"user\":\"What is the next 100x coin ?\"}]}",
    },
  },
  async run({ $ }) {
    // Parse the messages string to JSON
    let body;
    try {
      body = JSON.parse(this.messages);
    } catch (error) {
      throw new Error(`Invalid JSON in messages parameter: ${error.message}`);
    }

    const response = await this.tokenMetrics.getTokenMetricsAi({
      $,
      body,
    });

    // Use $ context for export
    $.export("$summary", "Successfully sent query to Token Metrics AI chatbot");

    return response;
  },
};
