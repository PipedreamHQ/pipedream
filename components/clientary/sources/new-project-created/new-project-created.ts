import { defineSource } from "@pipedream/types";
import common from "../common/common";

export default defineSource({
  ...common,
  key: "clientary-new-project-created",
  name: "New Project Created",
  description: "Emit new events when a new project was created. [See the docs](https://www.clientary.com/api/projects)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getConfig() {
      return {
        resourceFnName: "getProjects",
        resourceName: "projects",
        hasPaging: true,
      };
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getSummary(item: any): string {
      return `New project ${item.number} - ${item.name} ID(${item.id})`;
    },
  },
});
