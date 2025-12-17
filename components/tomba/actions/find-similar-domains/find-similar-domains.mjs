import app from "../../tomba.app.mjs";

export default {
  key: "tomba-find-similar-domains",
  name: "Find Similar Domains",
  description:
    "Retrieve similar domains based on a specific domain. [See the documentation](https://docs.tomba.io/api/~endpoints#similar)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    domain: {
      propDefinition: [
        app,
        "domain",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.findSimilarDomains({
      $,
      domain: this.domain,
    });

    $.export(
      "$summary",
      `Successfully found similar domains for: ${this.domain}`,
    );
    return response;
  },
};
