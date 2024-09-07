import app from "../../v7_darwin.app.mjs";

export default {
  key: "v7_darwin-add-instructions",
  name: "Add Instructions",
  description: "Add annotator instructions. [See the documentation](https://docs.v7labs.com/reference/adding-instructions)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    id: {
      propDefinition: [
        app,
        "id",
      ],
    },
    instructions: {
      propDefinition: [
        app,
        "instructions",
      ],
      description: "String of instructions. Written using HTML",
    },
  },
  async run({ $ }) {
    const response = await this.app.addInstructions({
      $,
      dataset_id: this.id,
      data: {
        instructions: this.instructions,
      },
    });

    $.export("$summary", `Successfully created Instruction in dataset with ID: '${this.id}'`);

    return response;
  },
};
