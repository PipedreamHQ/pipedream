import outgrow from "../../outgrow.app.mjs";

export default {
  props: {
    outgrow,
    db: "$.service.db",
  },
  methods: {
    processEvents() {
      throw new Error("processEvents is not implemented");
    },
  },
};
