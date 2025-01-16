import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import ragie from "../../ragie.app.mjs";

export default {
  key: "ragie-new-instruction",
  name: "New Instruction",
  description: "Emit new events whenever an instruction is added to a task in Ragie. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    ragie: {
      type: "app",
      app: "ragie",
    },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  hooks: {
    async deploy() {
      // Fetch the latest instructions, up to 50
      const instructions = await this.ragie.listInstructions({
        perpage: 50,
      });

      // Sort instructions by created_at descending (most recent first)
      instructions.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      // Take the first 50 and reverse to emit oldest first
      const latestInstructions = instructions.slice(0, 50).reverse();

      for (const instruction of latestInstructions) {
        this.$emit(instruction, {
          id: instruction.id,
          summary: `New Instruction: ${instruction.name}`,
          ts: new Date(instruction.created_at).getTime(),
        });
      }

      // Set the lastCreatedAt to the latest instruction's created_at
      if (instructions.length > 0) {
        const latestCreatedAt = instructions[0].created_at;
        await this.db.set("lastCreatedAt", latestCreatedAt);
      }
    },
    async activate() {
      // No-op
    },
    async deactivate() {
      // No-op
    },
  },
  async run() {
    // Get the last created_at timestamp
    const lastCreatedAt = await this.db.get("lastCreatedAt") || new Date(0).toISOString();

    // Fetch all instructions
    const instructions = await this.ragie.listInstructions({
      perpage: 50,
    });

    // Filter instructions newer than lastCreatedAt
    const newInstructions = instructions.filter(
      (instruction) => new Date(instruction.created_at) > new Date(lastCreatedAt),
    );

    // Sort newInstructions by created_at ascending
    newInstructions.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

    for (const instruction of newInstructions) {
      this.$emit(instruction, {
        id: instruction.id,
        summary: `New Instruction: ${instruction.name}`,
        ts: new Date(instruction.created_at).getTime(),
      });
    }

    if (newInstructions.length > 0) {
      // Update lastCreatedAt to the latest instruction's created_at
      const latestCreatedAt = newInstructions[newInstructions.length - 1].created_at;
      await this.db.set("lastCreatedAt", latestCreatedAt);
    }
  },
};
