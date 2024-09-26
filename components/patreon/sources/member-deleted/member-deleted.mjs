import base from "../common/base.mjs";

export default {
  ...base,
  key: "patreon-member-deleted",
  name: "Member Deleted",
  description: "Emit new event for each deleted member",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...base.methods,
    getTriggerType() {
      return "members:delete";
    },
  },
  async run(event) {
    const id = event.body.data.id;
    const member = event.body.data.attributes.full_name;
    const ts = new Date();

    console.log("Emitting event...");

    this.$emit(event.body, {
      id,
      summary: `Deleted member: ${member}`,
      ts,
    });
  },
};
