import aiTextraction from "../../ai_textraction.app.mjs";

export default {
  key: "ai_textraction-extract-data",
  name: "Extract Data",
  description: "Extract custom data from text using AI Textraction. [See the documentation](https://rapidapi.com/textractionai/api/ai-textraction)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    aiTextraction,
    text: {
      type: "string",
      label: "Text",
      description: "The text to extract entities from",
    },
    entities: {
      type: "string[]",
      label: "Entities",
      description: "An array of entity names to extract from the text. Example: `first_name`",
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (!this.entities?.length) {
      return props;
    }
    for (const entity of this.entities) {
      props[`${entity}_type`] = {
        type: "string",
        label: `${entity} - Type`,
        description: `The type of results to return for ${entity}`,
        options: [
          "string",
          "integer",
          "array[string]",
          "array[integer]",
        ],
      };
      props[`${entity}_description`] = {
        type: "string",
        label: `${entity} - Description`,
        description: `Description of the entity ${entity}. Example: \`First name of the person\``,
      };
    }
    return props;
  },
  async run({ $ }) {
    const entities = this.entities.map((entity) => ({
      var_name: entity,
      type: this[`${entity}_type`],
      description: this[`${entity}_description`],
    }));

    const response = await this.aiTextraction.extractData({
      $,
      data: {
        text: this.text,
        entities,
      },
    });

    $.export("$summary", "Successfully extracted data from text");
    return response;
  },
};
