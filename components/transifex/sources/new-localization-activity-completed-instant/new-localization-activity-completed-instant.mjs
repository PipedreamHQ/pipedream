import transifex from "../../transifex.app.mjs";
import crypto from "crypto";
import { axios } from "@pipedream/platform";

export default {
  key: "transifex-new-localization-activity-completed-instant",
  name: "New Localization Activity Completed (Instant)",
  description: "Emit new event when a resource language is completely translated, reviewed, or filled up by TM or MT. [See the documentation](https://developers.transifex.com/reference/post_project-webhooks)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    transifex: {
      type: "app",
      app: "transifex",
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    resourceId: {
      propDefinition: [
        transifex,
        "resourceId",
      ],
    },
    languageCode: {
      propDefinition: [
        transifex,
        "languageCode",
      ],
    },
  },
  hooks: {
    async deploy() {
      const resources = await this.transifex.listResources();
      for (const resource of resources) {
        const languages = await this.transifex.listLanguages();
        for (const language of languages) {
          await this.transifex.emitResourceLanguageEvent({
            resourceId: resource.id,
            languageCode: language.code,
          });
        }
      }
    },
    async activate() {
      const webhookData = {
        url: this.http.endpoint,
        events: [
          "resource.translation.completed",
          "resource.translation.reviewed",
          "resource.translation.filled",
        ],
      };
      const response = await axios(this, {
        method: "POST",
        url: `${this.transifex._baseUrl()}/project-webhooks`,
        headers: {
          "Authorization": `Bearer ${this.transifex.$auth.oauth_access_token}`,
          "Content-Type": "application/json",
        },
        data: webhookData,
      });
      this.db.set("webhookId", response.id);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      if (webhookId) {
        await axios(this, {
          method: "DELETE",
          url: `${this.transifex._baseUrl()}/project-webhooks/${webhookId}`,
          headers: {
            Authorization: `Bearer ${this.transifex.$auth.oauth_access_token}`,
          },
        });
        this.db.set("webhookId", null);
      }
    },
  },
  async run(event) {
    const computedSignature = crypto.createHmac("sha256", this.transifex.$auth.secret).update(event.body)
      .digest("base64");
    if (computedSignature !== event.headers["x-transifex-signature"]) {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }
    const {
      resourceId, languageCode,
    } = this;
    await this.transifex.emitResourceLanguageEvent({
      resourceId,
      languageCode,
    });
    this.http.respond({
      status: 200,
      body: "OK",
    });
  },
};
