import base from "../common/base.mjs";

export default {
  ...base,
  key: "patreon-member-created",
  name: "Member Created",
  description: "Emit new event for each created member",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...base.methods,
    getTriggerType() {
      return "members:create";
    },
  },
  async run(event) {
    const id = event.body.data.id;
    const member = event.body.data.attributes.full_name;
    const ts = new Date();

    console.log("Emitting event...");

    this.$emit(event.body, {
      id,
      summary: `New member: ${member}`,
      ts,
    });
  },
};
