const yotpo = require('../../yotpo.app.js')

module.exports = {
  name: 'yotpo-new-reviews',
  version: '0.0.1',
  props: {
    http: {
      type: "$.interface.http",
    },
    yotpo,
  },
  hooks: {
    async activate() {
      await this.yotpo.createWebhook("review_create", this.http.endpoint)
      await this.yotpo.createWebhook("review_updated", this.http.endpoint)
      await this.yotpo.sendTestEvents()
      
    },
    async deactivate() {
      await this.yotpo.deleteWebhook("review_create", this.http.endpoint)
      await this.yotpo.deleteWebhook("review_updated", this.http.endpoint)
    },
  },
  async run(event) {
    this.$emit(event)
  },
}h
