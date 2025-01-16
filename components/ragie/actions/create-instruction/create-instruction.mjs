import ragie from "../../ragie.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "ragie-create-instruction",
  name: "Create Instruction",
  description: "Creates a new instruction in Ragie. [See the documentation](https://docs.ragie.ai/reference/createinstruction)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    ragie,
    name: {
      propDefinition: [
        ragie,
        "createInstructionName",
      ],
    },
    prompt: {
      propDefinition: [
        ragie,
        "createInstructionPrompt",
      ],
    },
    active: {
      propDefinition: [
        ragie,
        "createInstructionActive",
      ],
    },
    scope: {
      propDefinition: [
        ragie,
        "createInstructionScope",
      ],
    },
    filter: {
      propDefinition: [
        ragie,
        "createInstructionFilter",
      ],
    },
    partition: {
      propDefinition: [
        ragie,
        "createInstructionPartition",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.ragie.createInstruction({
      createInstructionName: this.name,
      createInstructionPrompt: this.prompt,
      ...(this.active !== undefined && {
        createInstructionActive: this.active,
      }),
      ...(this.scope !== undefined && {
        createInstructionScope: this.scope,
      }),
      ...(this.filter !== undefined && {
        createInstructionFilter: this.filter,
      }),
      ...(this.partition !== undefined && {
        createInstructionPartition: this.partition,
      }),
    });
    $.export("$summary", `Created instruction ${this.name}`);
    return response;
  },
};
