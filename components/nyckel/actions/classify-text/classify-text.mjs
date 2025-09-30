import nyckel from "../../nyckel.app.mjs";

export default {
  key: "nyckel-classify-text",
  name: "Classify Text",
  description: "Classifies text data based on pre-trained classifiers in Nyckel.  [See the documentation](https://www.nyckel.com/docs#invoke-text)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    nyckel,
    functionId: {
      propDefinition: [
        nyckel,
        "functionId",
      ],
    },
    textInput: {
      type: "string",
      label: "Text Input",
      description: "The text input to classify",
    },
    labelCount: {
      propDefinition: [
        nyckel,
        "labelCount",
      ],
    },
    includeMetadata: {
      propDefinition: [
        nyckel,
        "includeMetadata",
      ],
    },
    capture: {
      propDefinition: [
        nyckel,
        "capture",
      ],
    },
    externalId: {
      propDefinition: [
        nyckel,
        "externalId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.nyckel.invokeFunction({
      $,
      functionId: this.functionId,
      data: {
        data: this.textInput,
      },
      params: {
        labelCount: this.labelCount,
        includeMetadata: this.includeMetadata,
        capture: this.capture,
        externalId: this.externalId,
      },
    });

    $.export("$summary", "Successfully classified text data");
    return response;
  },
};
