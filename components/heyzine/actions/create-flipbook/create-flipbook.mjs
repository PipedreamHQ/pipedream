import heyzine from "../../heyzine.app.mjs";

export default {
  key: "heyzine-create-flipbook",
  name: "Create Flipbook",
  description: "Generates a new flipbook within your Heyzine account. [See the documentation](https://heyzine.com)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    heyzine,
    sourceFile: {
      propDefinition: [
        heyzine,
        "sourceFile",
      ],
    },
    targetDestination: {
      propDefinition: [
        heyzine,
        "targetDestination",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.heyzine.generateNewFlipbook(this.sourceFile, this.targetDestination);
    $.export("$summary", `Successfully created a new flipbook with ID: ${response.id}`);
    return response;
  },
};
