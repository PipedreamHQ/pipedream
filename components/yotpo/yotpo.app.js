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
    async sendTestEvents() {
      const api = this.api().core
      const response = await api.post("/reviews/dynamic_create", {
        "appkey": this.$aut.app_key,
        "domain": "http://www.pipedream.com",
        "sku": "10",
        "product_title": "Test Product",
        "product_description": "Test product description.",
        "product_url": "https://docs.pipedream.com/event-sources/#creating-event-sources",
        "product_image_url": "https://docs.pipedream.com/pipedream.svg",
        "display_name": "Test User",
        "email": "test.user@pipedream.com",
        "review_content": "This is the best product ever.",
        "review_title": "It changed my life",
        "review_score": 5,
        "time_stamp": Date.now(),
      })
      const review = _get(response, "data.response.reviews.0")
      console.log("Sent test event (review_create):", review || "No response when sending test event")
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
