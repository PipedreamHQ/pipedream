main_example = """## Example component

Here's an example component:

```
import github from "../../github.app.mjs"
import crypto from "crypto"
import { axios } from "@pipedream/platform"
export default {
  key: "github-new-notification-received",
  name: "New Notification Received",
  description: "Emit new event when a notification is received. [See the documentation](${docsLink})",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    github: {
      type: "app",
      app: "github",
    },
    http: {
      type: ""$.interface.http"",
      customResponse: true, // optional: defaults to false
    },
    db: "$.service.db",
  },
  methods: {
    _getWebhookId() {
      return this.db.get("webhookId")
    },
    _setWebhookId(id) {
      this.db.set("webhookId", id)
    },
  },
  hooks: {
    async deploy() {
      const events = await this.github.listMostRecentNotifications({paginate: true, max: 50});
      for (const event of events) {
        this.$emit(event, {
          id: event.id,
          summary: `New event: ${event.name}`,
          ts: Date.parse(event.ts),
        })
      }
    },
    async activate() {
      const hookId = await this.github.createWebhook(opts)
      this._setWebhookId(hookId)
    },
    async deactivate() {
      const id = this._getWebhookId()
      await this.github.deleteWebhook(id)
    },
  },
  async run(event) {
    const computedSignature = crypto.createHmac(sha256, secretKey).update(rawBody).digest("base64")
    if (computedSignature !== webhookSignature) {
      this.http.respond({ status: 401, body: "Unauthorized" })
      return
    }
    console.log(`Emitting event...`)
    this.$emit(event, {
      id: event.id,
      summary: `New event: ${event.name}`,
      ts: Date.parse(event.ts),
    })
  },
};
```"""
