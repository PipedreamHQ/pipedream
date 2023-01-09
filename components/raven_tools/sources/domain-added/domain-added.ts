import { defineSource } from "@pipedream/types";
import { DOCS } from "../../common/constants";
import common from "../common";
import { Domain } from "../../common/types";

export default defineSource({
  ...common,
  key: "raven_tools-domain-added",
  name: "New Domain Added",
  description: `Emit new event when a domain is added [See docs here](${DOCS.domainAdded})`,
  version: "0.0.1",
  type: "source",
  methods: {
    ...common.methods,
    getEntityName() {
      return "Domain";
    },
    async getResources(): Promise<Domain[]> {
      return this.app.listDomains();
    },
  },
});
