import hostaway from "../../hostaway.app.mjs";

export default {
  props: {
    hostaway,
  },
  methods: {
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
  },
};
