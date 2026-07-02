import { ConfigurationError } from "@pipedream/platform";
import app from "../../caesar.app.mjs";

export default {
  key: "caesar-get-document",
  name: "Get Document",
  description: "Read a document as clean markdown by Caesar `doc_id` or canonical URL. Free and anonymous, with no API key required. [See the documentation](https://docs.trycaesar.com)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    docId: {
      propDefinition: [
        app,
        "docId",
      ],
    },
    canonicalUrl: {
      propDefinition: [
        app,
        "canonicalUrl",
      ],
    },
    query: {
      propDefinition: [
        app,
        "query",
      ],
      optional: true,
      description: "Optional query to focus the read on the most relevant passages.",
    },
    include: {
      propDefinition: [
        app,
        "include",
      ],
    },
  },
  async run({ $ }) {
    const target = this.docId || this.canonicalUrl;
    if (!target) {
      throw new ConfigurationError("Provide a Document ID or a Canonical URL.");
    }
    const response = await this.app.read({
      target,
      query: this.query,
      include: this.include,
    });
    $.export("$summary", `Retrieved document \`${target}\`.`);
    return response;
  },
};
