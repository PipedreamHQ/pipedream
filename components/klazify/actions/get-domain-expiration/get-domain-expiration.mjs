import app from "../../klazify.app.mjs";

export default {
  key: "klazify-get-domain-expiration",
  name: "Get Domain Expiration",
  description: "Get the expiration date of a domain. [See the documentation](https://www.klazify.com/category#docs).",
  type: "action",
  version: "0.0.1",
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
    getDomainExpiration(args = {}) {
      return this.app.post({
        path: "/domain_expiration",
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const response = await this.getDomainExpiration({
      step,
      data: {
        url: this.url,
      },
    });

    step.export("$summary", `Successfully retrieved domain expiration for ${this.url}`);

    return response;
  },
};
