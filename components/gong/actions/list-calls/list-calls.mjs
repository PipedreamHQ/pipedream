import app from "../../gong.app.mjs";

export default {
  key: "gong-list-calls",
  name: "List calls",
  description: "List calls. [See the documentation](https://us-66463.app.gong.io/settings/api/documentation#get-/v2/calls)",
  type: "action",
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
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
    cursor: {
      optional: true,
      type: "string",
      label: "Cursor",
      description: "The cursor to start from. This is returned by the previous step",
    },
  },
  run({ $: step }) {
    const {
      app,
      cursor,
      ...params
    } = this;

    return app.listCalls({
      step,
      params: {
        ...params,
        cursor,
      },
      summary: (response) => `Successfully listed calls with request ID \`${response.requestId}\``,
    });
  },
};
