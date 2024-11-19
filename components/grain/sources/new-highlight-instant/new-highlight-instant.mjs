import grain from "../../grain.app.mjs";
import { axios } from "@pipedream/platform";
import crypto from "crypto";

export default {
  key: "grain-new-highlight-instant",
  name: "New Highlight Added",
  description: "Emit new event when a highlight that matches the filter is added. [See the documentation](https://grainhq.notion.site/Grain-Public-API-877184aa82b54c77a875083c1b560de9)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    grain,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  hooks: {
    async deploy() {
      const options = {
        path: "/_/public-api/recordings",
        params: {
          include_highlights: true,
        },
      };
      const recordings = await this.grain._makeRequest(options);
      const highlights = recordings.flatMap((recording) => recording.highlights || []);
      highlights.slice(0, 50).forEach((highlight) => {
        this.$emit(highlight, {
          id: highlight.id,
          summary: `New highlight: ${highlight.text}`,
          ts: Date.parse(highlight.created_datetime),
        });
      });
    },
    async activate() {
      const response = await this.grain._makeRequest({
        method: "POST",
        path: "/_/public-api/hooks",
        data: {
          hook_url: this.http.endpoint,
          events: [
            "highlight_added",
          ],
        },
        headers: {
          Authorization: `Bearer ${this.grain.$auth.oauth_access_token}`,
        },
      });
      this.db.set("webhookId", response.id);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      if (webhookId) {
        await this.grain._makeRequest({
          method: "DELETE",
          path: `/_/public-api/hooks/${webhookId}`,
          headers: {
            Authorization: `Bearer ${this.grain.$auth.oauth_access_token}`,
          },
        });
      }
    },
  },
  async run(event) {
    const webhookSignature = this.http.headers["x-grain-signature"];
    const rawBody = JSON.stringify(event.body);
    const secretKey = this.grain.$auth.oauth_access_token; // Assuming token is used as secret
    const computedSignature = crypto.createHmac("sha256", secretKey).update(rawBody)
      .digest("base64");

    if (computedSignature !== webhookSignature) {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }

    const {
      type, data,
    } = event.body;
    if (type === "highlight_added") {
      this.$emit(data, {
        id: data.id,
        summary: `New highlight added: ${data.text}`,
        ts: Date.parse(data.created_datetime),
      });
    }
  },
};
