import common from "./webhook.mjs";

export default {
  ...common,
  methods: {
    ...common.methods,
    generateMeta({
      id, name, created,
    }) {
      return {
        id,
        summary: name.text,
        ts: Date.parse(created),
      };
    },
  },
};
