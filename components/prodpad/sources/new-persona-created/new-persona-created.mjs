import common from "../common/polling.mjs";

export default {
  ...common,
  key: "prodpad-new-persona-created",
  name: "New Persona Created",
  description: "Emit new event when a new persona is created. [See the docs](https://app.swaggerhub.com/apis-docs/ProdPad/prodpad/1.0#/Personas/GetPersonas).",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getRequestResourcesFn() {
      return this.app.listPersonas;
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        ts: Date.parse(resource.created_at),
        summary: `New Persona ${resource.id}`,
      };
    },
  },
};
