module.exports = {
  name: 'User Input Prop Example',
  version: '0.1',
  props: {
      msg: {
        type: "string",
        label: "Message",
        description: "Enter a message to `console.log()`"
      }
  },
  async run() {
    this.$emit(this.msg)
  }, 
}