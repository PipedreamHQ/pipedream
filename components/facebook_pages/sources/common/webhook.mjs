import crypto from "crypto";
import app from "../../facebook_pages.app.mjs";

export default {
  props: {
    app,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    page: {
      propDefinition: [
        app,
        "page",
      ],
    },
    verifyToken: {
      type: "string",
      label: "Verify Token",
      description: "A custom string you provide to Facebook for webhook verification. Facebook will send this token back when verifying your webhook endpoint.",
      default: crypto.randomBytes(16).toString("hex"),
    },
  },
  hooks: {
    async activate() {
      // Subscribe the page to the app with specified fields (page-level webhooks)
      await this.app.createPageSubscription({
        pageId: this.page,
        params: {
          subscribed_fields: this.getFields().join(","),
        },
      });

      // Store page ID for deactivation
      this._setPageId(this.page);

      console.log(`Webhook URL: ${this.http.endpoint}`);
      console.log(`Verify Token: ${this.verifyToken}`);
      console.log("Subscribed page-level webhooks for fields:", this.getFields());
    },
    async deactivate() {
      const pageId = this._getPageId();
      if (pageId) {
        await this.app.deletePageSubscription({
          pageId,
        });
      }
    },
  },
  methods: {
    _getPageId() {
      return this.db.get("pageId");
    },
    _setPageId(pageId) {
      this.db.set("pageId", pageId);
    },
    getFields() {
      throw new Error("getFields is not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
    processEvent() {
      throw new Error("processEvent is not implemented");
    },
  },
  async run({
    query, body, method,
  }) {
    // Handle webhook verification from Facebook
    if (method === "GET") {
      const mode = query["hub.mode"];
      const token = query["hub.verify_token"];
      const challenge = query["hub.challenge"];

      if (mode === "subscribe" && token === this.verifyToken) {
        console.log("Webhook verified");
        this.http.respond({
          status: 200,
          body: challenge,
        });
        return;
      } else {
        console.log("Webhook verification failed");
        this.http.respond({
          status: 403,
        });
        return;
      }
    }

    // Handle webhook events
    this.http.respond({
      status: 200,
    });

    if (body?.object === "page" && body?.entry) {
      body.entry.forEach((entry) => {
        if (entry.changes) {
          entry.changes.forEach((change) => {
            const eventData = this.processEvent(change);
            if (eventData) {
              const meta = this.generateMeta(eventData);
              this.$emit(eventData, meta);
            }
          });
        }
      });
    }
  },
};
