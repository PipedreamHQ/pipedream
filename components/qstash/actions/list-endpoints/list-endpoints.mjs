import qstash from "../../qstash.app.mjs";

export default {
  name: "List Endpoints",
  version: "0.0.1",
  key: "qstash-list-endpoints",
  description: "Returns all your existing endpoints.",
  props: {
    qstash,
  },
  type: "action",
  methods: {},
  async run({ $ }) {
    return this.qstash.listEndpoints({
      $,
    });
  },
};
