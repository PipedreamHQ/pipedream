import common from "../common/common-helper.mjs";

export default {
  ...common,
  name: "Classify Items into Categories",
  version: "0.0.10",
  key: "openai-classify-items-into-categories",
  description: "Classify items into specific categories using the Chat API",
  type: "action",
  props: {
    ...common.props,
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
      return `Categorized ${this.items.length} items into ${this.categories.length} categories`;
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
        categorizations = JSON.parse(assistantResponse);
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
