import { defineSource } from "@pipedream/types";
import { DOCS } from "../../common/constants";
import common from "../common";
import { Domain, Keyword } from "../../common/types";

export default defineSource({
  ...common,
  key: "raven_tools-keyword-added",
  name: "New Keyword Added",
  description: `Emit new event for each keyword added to a domain [See docs here](${DOCS.keywordAdded})`,
  version: "0.0.1",
  type: "source",
  props: {
    ...common.props,
    domain: {
      type: "string",
      label: "Domain",
      description: "The domain to watch for new keywords.",
      async options(): Promise<Domain[]> {
        return this.raven_tools.listDomains();
      },
    },
  },
  methods: {
    ...common.methods,
    getEntityName() {
      return "Keyword";
    },
    async getResources(): Promise<Keyword[]> {
      const { domain } = this;
      if (!domain) return [];

      return this.raven_tools.listKeywords(domain);
    },
  },
});
