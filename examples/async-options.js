module.exports = {
  name: 'Async Options Example',
  version: '0.1',
  props: {
    msg: {
      type: "string",
      label: "Message",
      description: "Select a message to `console.log()`",
      async options() {
        return [
          'This is option 1',
          'This is option 2',
        ]
      },
    }
  },
  async run() {
    this.$emit(this.msg)
  },
}