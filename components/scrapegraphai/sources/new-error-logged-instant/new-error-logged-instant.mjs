import scrapegraphai from "../../scrapegraphai.app.mjs";
import crypto from "crypto";
import { axios } from "@pipedream/platform";

export default {
  key: "scrapegraphai-new-error-logged-instant",
  name: "New Error Logged (Instant)",
  description: "Emit a new event when an error occurs during a scraping task. Users can filter by error type or scraping job for targeted monitoring. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    scrapegraphai,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    errorTypeFilter: {
      propDefinition: [
        scrapegraphai,
        "errorTypeFilter",
      ],
      optional: true,
    },
    scrapingJobFilter: {
      propDefinition: [
        scrapegraphai,
        "scrapingJobFilter",
      ],
      optional: true,
    },
  },
  methods: {
    _getWebhookId() {
      return this.db.get("webhookId");
    },
    _setWebhookId(id) {
      this.db.set("webhookId", id);
    },
  },
  hooks: {
    async deploy() {
      const recentErrors = await this.scrapegraphai.paginate(this.scrapegraphai.onErrorOccurred, {
        errorTypeFilter: this.errorTypeFilter,
        scrapingJobFilter: this.scrapingJobFilter,
      });

      const lastFiftyErrors = recentErrors.slice(-50);
      for (const error of lastFiftyErrors) {
        this.$emit(error, {
          id: error.id || `${Date.now()}-${error.ts}`,
          summary: `Error of type ${error.errorType} occurred in job ${error.scrapingJob}`,
          ts: Date.parse(error.timestamp) || Date.now(),
        });
      }
    },
    async activate() {
      const webhook = await this.scrapegraphai.onErrorOccurred({
        errorTypeFilter: this.errorTypeFilter,
        scrapingJobFilter: this.scrapingJobFilter,
      });
      this._setWebhookId(webhook.id);
    },
    async deactivate() {
      const webhookId = this._getWebhookId();
      if (webhookId) {
        await this.scrapegraphai._makeRequest({
          method: "DELETE",
          path: `/webhooks/${webhookId}`,
        });
        this._setWebhookId(null);
      }
    },
  },
  async run(event) {
    const signature = event.headers["x-scrapegraphai-signature"];
    const secret = this.scrapegraphai.$auth.api_key;
    const hash = crypto.createHmac("sha256", secret).update(event.body)
      .digest("hex");

    if (hash !== signature) {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }

    const errorEvent = JSON.parse(event.body);
    this.$emit(errorEvent, {
      id: errorEvent.id || `${Date.now()}-${errorEvent.timestamp}`,
      summary: `Error of type ${errorEvent.errorType} occurred in job ${errorEvent.scrapingJob}`,
      ts: Date.parse(errorEvent.timestamp) || Date.now(),
    });
  },
};
