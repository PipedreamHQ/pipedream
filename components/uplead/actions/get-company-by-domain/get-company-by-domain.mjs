import app from "../../uplead.app.mjs";

export default {
  name: "Get Company By Domain",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  key: "uplead-get-company-by-domain",
  description: "Get a company by domain. [See the documentation](https://docs.uplead.com/#company-api)",
  type: "action",
  props: {
    app,
    domain: {
      type: "string",
      label: "Domain",
      description: "Domain of the company. E.g. `pipedream.com`",
    },
  },
  async run({ $ }) {
    const response = await this.app.getCompanyByDomain({
      $,
      data: {
        domain: this.domain,
      },
    });

    if (response?.data?.id) {
      $.export("$summary", `Successfully retrieved company with ID \`${response.data.id}\``);
    }

    return response;
  },
};
