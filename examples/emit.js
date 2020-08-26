module.exports = {
  name: "this.$emit() example",
  description: "Deploy and run this component manually via the Pipedream UI",
  async run() {
    this.$emit({ message: "hello world!" })
  }
}