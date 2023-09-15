import app from "../../gong.app.mjs";

export default {
  key: "gong-list-calls",
  name: "List calls",
  description: "List calls. [See the documentation](https://us-66463.app.gong.io/settings/api/documentation#get-/v2/calls)",
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
