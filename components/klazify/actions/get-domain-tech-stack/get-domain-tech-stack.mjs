import app from "../../klazify.app.mjs";

export default {
  key: "klazify-get-domain-tech-stack",
  name: "Get Domain Tech Stack",
  description: "Get the technology stack of a domain. [See the documentation](https://www.klazify.com/category#docs).",
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
    getDomainTechStack(args = {}) {
      return this.app.post({
        path: "/domain_tech",
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const response = await this.getDomainTechStack({
      step,
      data: {
        url: this.url,
      },
    });

    step.export("$summary", `Successfully retrieved domain tech stack for ${this.url}`);

    return response;
  },
};
