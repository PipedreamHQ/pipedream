import common from "../common/common-helper.mjs";

export default {
  ...common,
  name: "Classify Items",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  key: "_302_ai-classify-items",
  description: "Classify input items into predefined categories using 302.AI models. Perfect for tagging, segmentation, and automated organization. [See documentation](https://doc.302.ai/147522039e0)",
  type: "action",
  props: {
    ...common.props,
    info: {
      type: "alert",
      alertType: "info",
      content: `Provide a list of **items** and a list of **categories**. The output will contain an array of objects, each with properties \`item\` and \`category\`
        \nExample:
        \nIf **Categories** is \`["people", "pets"]\`, and **Items** is \`["dog", "George Washington"]\`
        \n The output will contain the following categorizations:
        \n \`[{"item":"dog","category":"pets"},{"item":"George Washington","category":"people"}]\`
      `,
    },
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
      const responses = response.choices?.map(({ message }) => message.content);
      const categorizations = [];
      for (const response of responses) {
        try {
          categorizations.push(JSON.parse(response));
        } catch (err) {
          console.log("Failed to parse output, assistant returned malformed JSON");
        }
      }
      const output = {
        messages,
      };
      const n = this.n
        ? parseInt(this.n)
        : 1;
      if (n > 1) {
        output.categorizations = categorizations;
      } else {
        output.categorizations = categorizations[0];
      }
      return output;
    },
  },
};

