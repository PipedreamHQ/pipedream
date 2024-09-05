import app from "../../cohere_platform.app.mjs";
import { clearObj } from "../../common/utils.mjs";

export default {
  key: "cohere_platform-classify-text",
  name: "Classify Text",
  version: "0.1.0",
  description: "This action makes a prediction about which label fits the specified text inputs best. [See the documentation](https://docs.cohere.com/reference/classify-1)",
  type: "action",
  props: {
    app,
    inputs: {
      type: "string[]",
      label: "Inputs",
      description: "Represents a list of queries to be classified, each entry must not be empty. The maximum is 96 inputs.",
    },
    model: {
      propDefinition: [
        app,
        "classifyModel",
      ],
    },
    preset: {
      propDefinition: [
        app,
        "preset",
      ],
    },
    truncate: {
      propDefinition: [
        app,
        "truncate",
      ],
    },
    numExamples: {
      type: "integer",
      label: "Number of Examples",
      description: "To make a prediction, Classify uses provided examples of text + label pairs. Specify the number of examples to provide. Each example is a text string and its associated label/class. At least 2 unique labels must be provided and each label should have at least 2 different examples.",
      default: 4,
      reloadProps: true,
    },
  },
  additionalProps() {
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
  methods: {
    getExamples() {
      const examples = [];
      for (let i = 0; i < this.numExamples; i++) {
        examples.push({
          text: this[`text_${i}`],
          label: this[`label_${i}`],
        });
      }
      return examples;
    },
    classifyText(data) {
      return this.app.client().classify(data);
    },
  },
  async run({ $ }) {
    const {
      classifyText,
      inputs,
      model,
      preset,
      truncate,
      getExamples,
    } = this;

    const response = await classifyText(clearObj({
      inputs,
      model,
      preset,
      truncate,
      examples: getExamples(),
    }));

    $.export("$summary", `The text was successfully classified with ID \`${response.id}\``);
    return response;
  },
};
