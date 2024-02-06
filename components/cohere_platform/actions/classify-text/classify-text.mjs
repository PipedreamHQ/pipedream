import coherePlatform from "../../cohere_platform.app.mjs";

export default {
  key: "cohere_platform-classify-text",
  name: "Classify Text",
  version: "0.0.1",
  description: "This action makes a prediction about which label fits the specified text inputs best. [See the docs here](https://docs.cohere.com/reference/classify)",
  type: "action",
  props: {
    coherePlatform,
    inputs: {
      type: "string[]",
      label: "Inputs",
      description: "Represents a list of queries to be classified, each entry must not be empty. The maximum is 96 inputs.",
    },
    classifyModel: {
      propDefinition: [
        coherePlatform,
        "classifyModel",
      ],
    },
    preset: {
      propDefinition: [
        coherePlatform,
        "preset",
      ],
    },
    truncate: {
      propDefinition: [
        coherePlatform,
        "truncate",
      ],
    },
    numExamples: {
      type: "integer",
      label: "Number of Examples",
      description: "To make a prediction, Classify uses provided examples of text + label pairs. Specify the number of examples to provide. Each example is a text string and its associated label/class. At least 2 labels must be provided.",
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};

    for (let i = 0; i < this.numExamples; i++) {
      props[`text_${i}`] = {
        type: "string",
        label: `Example ${i + 1} Text`,
        description: "Text string of the example",
      };
      props[`label_${i}`] = {
        type: "string",
        label: `Example ${i + 1} Label`,
        description: "Label of the example. Each unique label requires at least 2 examples associated with it.",
      };
    }

    return props;
  },
  async run({ $ }) {
    const examples = [];
    for (let i = 0; i < this.numExamples; i++) {
      examples.push({
        text: this[`text_${i}`],
        label: this[`label_${i}`],
      });
    }

    const response = await this.coherePlatform.classifyText({
      inputs: this.inputs,
      model: this.model,
      preset: this.preset,
      truncate: this.truncate,
      examples,
    });

    if (response.statusCode != "200") {
      throw new Error(response.body.message);
    }

    $.export("$summary", "The text was successfully classified.");
    return response;
  },
};
