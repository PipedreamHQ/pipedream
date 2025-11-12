import azureOpenAI from "../../azure_openai_service.app.mjs";
import common from "../common/common-helper.mjs";

export default {
  ...common,
  key: "azure_openai_service-classify-items-into-categories",
  name: "Classify Items Into Categories",
  description: "Classify items into specific categories. [See the documentation](https://learn.microsoft.com/en-us/azure/ai-services/openai/reference#chat-completions)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    azureOpenAI,
    items: {
      label: "Items",
      description: "Items to categorize",
      type: "string[]",
    },
    categories: {
      label: "Categories",
      description: "Categories to classify items into",
      type: "string[]",
    },
    ...common.props,
  },
  methods: {
    ...common.methods,
    systemInstructions() {
      return "Your goal is to categorize items into specific categories and produce ONLY JSON. The user will provide both the items and categories. Please only categorize items into the specific categories, and no others, and output ONLY JSON.";
    },
    outputFormat() {
      return "Please only categorize items into the specific categories, and no others. Output a valid JSON string — an array of objects, where each object has the following properties: item, category. Do not return any English text other than the JSON, either before or after the JSON. I need to parse the response as JSON, and parsing will fail if you return any English before or after the JSON";
    },
    userMessage() {
      return `Categorize each of the following items:\n\n${this.items.join("\n")}\n\ninto one of the following categories:\n\n${this.categories.join("\n")}\n\n${this.outputFormat()}}`;
    },
    summary() {
      return `Categorized ${this.items.length} items into ${this.categories.length} categories.`;
    },
    formatOutput({
      messages, response,
    }) {
      if (!messages || !response) {
        throw new Error("Invalid API output, please reach out to https://pipedream.com/support");
      }
      const assistantResponse = response.choices?.[0]?.message?.content;
      let categorizations = assistantResponse;
      try {
        const categorizationJSON = assistantResponse.substring(
          assistantResponse.indexOf("```json") + 7,
          assistantResponse.lastIndexOf("```"),
        ).trim();
        categorizations = JSON.parse(categorizationJSON);
      } catch (err) {
        console.log("Failed to parse output, assistant returned malformed JSON");
      }
      return {
        categorizations,
        messages,
      };
    },
  },
};
