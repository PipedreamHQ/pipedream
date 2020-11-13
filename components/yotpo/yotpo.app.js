const axios = require("axios")
const _get = require("lodash.get")

module.exports = {
  type: "app",
  app: "yotpo",
  methods: {
    api() {
      return {
        core: axios.create({
          baseURL: `https://api.yotpo.com`,
          headers: {
            Authorization: `Bearer ${this.$auth.oauth_access_token}`,
            Accept: "application/json",
          },
        }),
        dev: axios.create({
          baseURL: `https://developers.yotpo.com/v2/${this.$auth.app_key}`,
          params: {
            access_token: this.$auth.oauth_access_token,
          },
        }),
      }
    },
    async createWebhook(event_name = "review_create", url) {
      const api = this.api().dev
      const webhook = _get(await api.get("/webhooks"), "data.webhooks.webhooks", []).find(w => w.webhook_event_name == event_name)
      if(webhook) {
        if (webhook.url != url) {
          console.error("Cannot setup Yotpo webhook. An existing webhook of this type already exists", webhook)
        } else {
          console.log("Existing webhook found:", webhook)
        }            
      } else {
        const response = await api.post("/webhooks", { event_name, url })
        console.log("Webhook created:", { event_name, url }, _get(response, "data", "No response when creating webhook"))
      }
    },
    async deleteWebhook(event_name = "review_create", url) {
      const api = this.api().dev
      const webhook = _get(await api.get("/webhooks"), "data.webhooks.webhooks", []).find(w => w.webhook_event_name == event_name)
      if (webhook && webhook.id) {
        if (webhook.url == url) {
          const response = await api.delete(`/webhooks/${webhook.id}`)
          console.log("Webhook deleted", webhook, _get(response, "data", "No response when deleting webhook"))
        } else {
          console.error("Cannot delete webhook - existing webhook does not match this endpoint:", {event_name, url}, webhook)
        }
      } else {
        console.error("Cannot delete webhook - not found:", {event_name, url})
      }
    },
  },
}
