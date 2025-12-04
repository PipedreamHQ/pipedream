import common from "../common/polling.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "tmetric-new-task",
  name: "New Task",
  description: "Emit new event when a task is created. [See the docs here](https://app.tmetric.com/api-docs/?_gl=1*n76hcy*_gcl_aw*R0NMLjE3NjQwOTU2MDguQ2owS0NRaUF4SlhKQmhEX0FSSXNBSF9KR2pncU8zZzgxcHp3VUhQWGdjazEyUWFTaThXeE00ZTBUZ1hvak5ma1AzeG10a1pGYWJuek8wOGFBbC1KRUFMd193Y0I.*_gcl_au*MjU2MzU4NTI3LjE3NjQwOTU2MDg.*_ga*ODE4ODUyMDE2LjE3NjQwOTU2MDM.*_ga_66EFKVJKC5*czE3NjQwOTU2MDMkbzEkZzEkdDE3NjQwOTYyODkkajQzJGwwJGgw#/Tasks/get-accounts-accountId-tasks)",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.app.getTasks;
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        ts: Date.parse(resource.created),
        summary: `New task created with ID: ${resource.id}`,
      };
    },
  },
  sampleEmit,
};
