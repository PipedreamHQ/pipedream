import qstash from "../../qstash.app.mjs";

export default {
  name: "List Topics",
  version: "0.0.1",
  key: "qstash-list-topics",
  description: "Returns all your existing topics.",
  props: {
    qstash,
  },
  type: "action",
  methods: {},
  async run({ $ }) {
    return await this.qstash.listTopics({
      $,
    });
  },
};
