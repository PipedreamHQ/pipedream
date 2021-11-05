import zohoCreator from "../../zoho_creator.app.mjs";

export default {
  key: "zoho_creator-new-or-updated-record",
  description: "Emit events on new or updated records",
  type: "source",
  version: "0.0.3",
  props: {
    zohoCreator,
  },
  methods: {},
  async run(event) {
    this.$emit(
      {
        event,
      },
      {
        summary: "Hello, world!",
        ts: Date.now(),
      },
    );
  },
};
