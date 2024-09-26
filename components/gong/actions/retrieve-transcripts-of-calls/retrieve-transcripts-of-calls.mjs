import app from "../../gong.app.mjs";

export default {
  key: "gong-retrieve-transcripts-of-calls",
  name: "Retrieve Transcripts Of Calls",
  description: "Retrieve transcripts of calls. [See the documentation](https://us-66463.app.gong.io/settings/api/documentation#post-/v2/calls/transcript)",
  type: "action",
  version: "0.0.1",
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
    workspaceId: {
      optional: true,
      propDefinition: [
        app,
        "workspaceId",
      ],
    },
  },
  methods: {
    retrieveTranscriptsOfCalls(args = {}) {
      return this.app.post({
        path: "/calls/transcript",
        ...args,
      });
    },
  },
  run({ $: step }) {
    const {
      // eslint-disable-next-line no-unused-vars
      app,
      retrieveTranscriptsOfCalls,
      ...filter
    } = this;

    return retrieveTranscriptsOfCalls({
      step,
      data: {
        filter,
      },
      summary: (response) => `Successfully retrieved transcripts of calls with request ID \`${response.requestId}\``,
    });
  },
};
