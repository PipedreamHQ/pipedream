module.exports = {
  name: 'Interval Example',
  version: '0.1',
  props: {
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 60 * 24 // Run job once a day
      }
    }
  },
  async run() {
      console.log('hello world!')
  }, 
}