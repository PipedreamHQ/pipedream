import app from "../../shorten_rest.app.mjs";

export default {
  key: "shorten_rest-get-clicks",
  name: "Get Clicks",
  description: "Gets the click data. [See the documentation](https://docs.shorten.rest/#tag/Click/operation/GetClicks)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
  },
  methods: {
    getClicks(args = {}) {
      return this.app._makeRequest({
        path: "/clicks",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const { getClicks } = this;

    const response = await getClicks({
      $,
    });
    $.export("$summary", `Successfully retrieved \`${response.clicks.length}\` click(s).`);
    return response;
  },
};
