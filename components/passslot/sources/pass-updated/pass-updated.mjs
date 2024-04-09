import common from "../common/base-polling.mjs";
import md5 from "md5";

export default {
  ...common,
  key: "passslot-pass-updated",
  name: "Pass Updated",
  description: "Emit new event when an existing pass is updated in PassSlot. [See the documentation](https://www.passslot.com/developer/api/resources/showPassValues)",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  hooks: {
    async deploy() {
      await this.processEvent();
    },
  },
  methods: {
    ...common.methods,
    _getPreviousValues() {
      return this.db.get("previousValues") || {};
    },
    _setPreviousValues(previousValues) {
      return this.db.set("previousValues", previousValues);
    },
    generateMeta({ pass }) {
      const ts = Date.now();
      return {
        id: `${pass.serialNumber}${ts}`,
        summary: `Pass Updated ${pass.serialNumber}`,
        ts,
      };
    },
    async processEvent() {
      const previousValues = this._getPreviousValues();
      const passes = await this.passslot.listPasses();
      for (const pass of passes) {
        const values = await this.passslot.getPassValues({
          passTypeIdentifier: pass.passType,
          passSerialNumber: pass.serialNumber,
        });
        const hash = md5(JSON.stringify(values));
        if (previousValues[pass.serialNumber] !== hash) {
          previousValues[pass.serialNumber] = hash;
          this.emitEvent({
            pass,
            values,
          });
        }
      }
      this._setPreviousValues(previousValues);
    },
  },
  async run() {
    await this.processEvent();
  },
};
