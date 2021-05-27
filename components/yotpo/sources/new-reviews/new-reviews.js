const _get = require("lodash.get")
const _truncate = require("lodash.truncate")
const he = require("he")
const moment = require('moment')
const yotpo = require('../../yotpo.app.js')
module.exports = {
  name: "New Reviews",
  description: "Emits a new event any time a Yotpo review is created or updated",
  key: "yotpo-new-reviews",
  version: '0.0.1',
  dedupe: "unique",
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
    },
    async deactivate() {
      await this.yotpo.deleteWebhook("review_create", this.http.endpoint)
      await this.yotpo.deleteWebhook("review_updated", this.http.endpoint)
    },
  },
  async run(event) {
    const id = _get(event, "body.data.id")
    const updatedAt = _get(event, "body.data.updated_at")
    if (id && updatedAt) {
      const dedupeId = `${id}-${updatedAt}`
      const flag = _get(event, "body.data.new") ? "" : " [UPDATED]"
      const score = _get(event, "body.data.score", "?")
      const text = _truncate(he.decode(_get(event, "body.data.title", _get(event, "body.data.content", "- no content -"))))
      const summary =  `${score} stars:${flag} ${text}`
      const ts = moment(updatedAt).valueOf()
      this.$emit(event.body, { id: dedupeId, summary, ts })
    }
  },
}
