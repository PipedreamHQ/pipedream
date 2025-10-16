import app from "../../klazify.app.mjs";

export default {
  key: "klazify-get-company-domain-info",
  name: "Get Company Domain Info",
  description: "Get information about a company's domain. [See the documentation](https://www.klazify.com/category#docs).",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    url: {
      propDefinition: [
        app,
        "url",
      ],
    },
  },
  methods: {
    getCompanyDomainInfo(args = {}) {
      return this.app.post({
        path: "/domain_company",
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const response = await this.getCompanyDomainInfo({
      step,
      data: {
        url: this.url,
      },
    });

    step.export("$summary", `Successfully retrieved domain info for ${this.url}`);

    return response;
  },
};
