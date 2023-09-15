import app from "../../gong.app.mjs";

export default {
  key: "gong-retrieve-transcripts-of-calls",
  name: "Retrieve Transcripts Of Calls",
  description: "Retrieve transcripts of calls. [See the documentation](https://us-66463.app.gong.io/settings/api/documentation#post-/v2/calls/transcript)",
  type: "action",
  version: "0.0.1",
  props: {
    app,
  },
  methods: {
    request(args = {}) {
      return this.app.makeRequest({
        path: "/path",
        ...args,
      });
    },
  },
  run({ $: step }) {
    const {
      // eslint-disable-next-line no-unused-vars
      app,
      request,
      ...data
    } = this;

    return request({
      step,
      data,
      summary: (response) => `Response: ${response.id}`,
    });
  },
};
