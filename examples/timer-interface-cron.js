module.exports = {
  name: 'Cron Example',
  version: '0.1',
  props: {
    timer: {
      type: "$.interface.timer",
      default: {
        cron: "0 0 * * *" // Run job once a day
      }
    }
  },
  async run() {
      console.log('hello world!')
  }, 
}