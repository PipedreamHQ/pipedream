import common from "../common/base-polling.mjs";

export default {
  ...common,
  key: "passslot-new-pass-created",
  name: "New Pass Created",
  description: "Emit new event when a new pass is created in PassSlot. [See the documentation](https://www.passslot.com/developer/api/resources/listPasses)",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  hooks: {
    async deploy() {
      const passes = await this.passslot.listPasses();
      passes.forEach((pass) => this.emitEvent(pass));
    },
  },
  methods: {
    ...common.methods,
    generateMeta(pass) {
      return {
        id: pass.serialNumber,
        summary: `New Pass ${pass.serialNumber}`,
        ts: Date.now(),
      };
    },
  },
  async run() {
    const passes = await this.passslot.listPasses();
    passes.forEach((pass) => this.emitEvent(pass));
  },
};
