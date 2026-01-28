import common from "../common/base.mjs";

export default {
  ...common,
  key: "marketo-new-program",
  name: "New Program",
  description: "Emit new event when a program is created. [See the documentation](https://developer.adobe.com/marketo-apis/api/asset/#tag/Programs/operation/browseProgramsUsingGET)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    generateMeta(program) {
      return {
        id: program.id,
        summary: `New program: ${program.name}`,
        ts: Date.parse(program.createdAt),
      };
    },
    getResourceFn() {
      return this.app.listPrograms;
    },
    getParams(lastTs) {
      const params = {
        maxReturn: 200,
      };

      if (lastTs) {
        params.earliestUpdatedAt = new Date(lastTs).toISOString();
      }

      return params;
    },
    processEvent(item) {
      return Date.parse(item.createdAt);
    },
  },
};
