import app from "../../gong.app.mjs";

export default {
  key: "gong-list-calls",
  name: "List calls",
  description: "List calls. [See the documentation](https://us-66463.app.gong.io/settings/api/documentation#get-/v2/calls)",
  type: "action",
  version: "0.0.3",
  props: {
    app,
    fromDateTime: {
      optional: true,
      propDefinition: [
        app,
        "fromDateTime",
      ],
    },
    toDateTime: {
      optional: true,
      propDefinition: [
        app,
        "toDateTime",
      ],
    },
  },
  run({ $: step }) {
    const {
      app,
      ...params
    } = this;

    return app.listCalls({
      step,
      params,
      summary: (response) => `Successfully listed calls with request ID \`${response.requestId}\``,
    });
  },
};
