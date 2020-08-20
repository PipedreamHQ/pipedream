const stripe = require("https://github.com/PipedreamHQ/pipedream/components/stripe/stripe.app.js")

module.exports = {
  name: "Customizable events webhook",
  props: {
    stripe,
    enabledEvents: {
      type: "string[]",
      label: "Events to listen for (select '*' for all)",
      options() {
        return this.stripe.enabledEvents()
      },
    },
    http: "$.interface.http",
    db: "$.service.db",
  },
  hooks: {
    async activate() {
      let enabledEvents = this.enabledEvents
      if (enabledEvents.includes('*')) enabledEvents = ['*']
      const endpoint = await this.stripe.sdk().webhookEndpoints.create({
        url: this.http.endpoint,
        enabled_events: enabledEvents,
      })
      this.db.set("endpoint", JSON.stringify(endpoint))
    },
    async deactivate() {
      const endpoint = this.getEndpoint()
      this.db.set("endpoint", null)
      if (!endpoint) return
      const confirmation = await this.stripe.sdk().webhookEndpoints.del(endpoint.id)
      if ("deleted" in confirmation && !confirmation.deleted) {
        throw new Error("endpoint not deleted")
      }
    },
  },
  run(event) {
    const endpoint = this.getEndpoint()
    if (!endpoint) {
      this.http.respond({status: 500})
      throw new Error("endpoint config missing from db")
    }
    const sig = event.headers["stripe-signature"]
    try {
      event = this.stripe.sdk().webhooks.constructEvent(event.bodyRaw, sig, endpoint.secret)
    } catch (err) {
      this.http.respond({status: 400, body: err.message})
      console.log(err.message)
      return
    }
    this.http.respond({status: 200})
    this.$emit(event)
  },
  methods: {
    getEndpoint() {
      let endpoint
      const endpointJson = this.db.get("endpoint")
      try {
        endpoint = JSON.parse(endpointJson)
      } catch (err) {}
      return endpoint
    },
  },
}
