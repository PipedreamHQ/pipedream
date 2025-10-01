import app from "../../klazify.app.mjs";

export default {
  key: "klazify-categorize-website",
  name: "Categorize Website",
  description: "Submit a website URL for categorization by the API. [See the documentation](https://www.klazify.com/category#docs).",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
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
    categorizeWebsite(args = {}) {
      return this.app.post({
        path: "/categorize",
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const response = await this.categorizeWebsite({
      step,
      data: {
        url: this.url,
      },
    });

    step.export("$summary", `Successfully categorized ${this.url}`);

    return response;
  },
};
