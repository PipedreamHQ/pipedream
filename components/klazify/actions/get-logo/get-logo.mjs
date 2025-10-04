import app from "../../klazify.app.mjs";

export default {
  key: "klazify-get-logo",
  name: "Get Logo",
  description: "Get the logo of a company. [See the documentation](https://www.klazify.com/category#docs).",
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
    getLogo(args = {}) {
      return this.app.post({
        path: "/domain_logo",
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const response = await this.getLogo({
      step,
      data: {
        url: this.url,
      },
    });

    step.export("$summary", `Successfully retrieved logo for ${this.url}`);

    return response;
  },
};
