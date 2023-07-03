export default {
  async run(event) {
    this.$emit(event.body, {
      summary: "Customer has requested information",
      ts: Date.now(),
    });
  },
};
