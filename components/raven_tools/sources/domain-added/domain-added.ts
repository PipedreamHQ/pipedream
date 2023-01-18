import { defineSource } from "@pipedream/types";
import common from "../common";

const DOCS = "https://api.raventools.com/docs/#domains";

export default defineSource({
  ...common,
  key: "raven_tools-domain-added",
  name: "New Domain Added",
  description: `Emit new event when a domain is added [See docs here](${DOCS})`,
  version: "0.0.1",
  type: "source",
  methods: {
    ...common.methods,
    getEntityName() {
      return "Domain";
    },
    async getResources(): Promise<string[]> {
      return this.app.listDomains();
    },
  },
});
