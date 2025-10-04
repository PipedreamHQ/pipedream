import app from "../../klazify.app.mjs";

export default {
  key: "klazify-real-time-categorization",
  name: "Real Time Categorization",
  description: "Analize the URL content or email's domain (if the input is an email) and classifies it into 385+ possible topic categories. [See the documentation](https://www.klazify.com/category#docs).",
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
    realTimeCategorization(args = {}) {
      return this.app.post({
        path: "/real_time_categorization",
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const response = await this.realTimeCategorization({
      step,
      data: {
        url: this.url,
      },
    });

    step.export("$summary", `Successfully categorized ${this.url}`);

    return response;
  },
};
