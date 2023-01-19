import { defineSource } from "@pipedream/types";
import { ConfigurationError } from "@pipedream/platform";
import common from "../common";

const DOCS = "https://api.raventools.com/docs/#keywords";

export default defineSource({
  ...common,
  key: "raven_tools-keyword-added",
  name: "New Keyword Added",
  description: `Emit new event for each keyword added to a domain [See docs here](${DOCS})`,
  version: "0.0.1",
  type: "source",
  props: {
    ...common.props,
    domain: {
      propDefinition: [
        common.props.app,
        "domain",
      ],
      description: "The domain to watch for new keywords.",
    },
  },
  methods: {
    ...common.methods,
    getEntityName() {
      return "Keyword";
    },
    async getResources(): Promise<string[]> {
      const { domain } = this;
      if (!domain) {
        throw new ConfigurationError(
          "**Error:** prop `domain` must be configured",
        );
      }

      return this.app.listKeywords(domain);
    },
  },
});
