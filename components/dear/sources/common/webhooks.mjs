import { v4 as uuid } from "uuid";
import dear from "../../dear.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  props: {
    dear,
    db: "$.service.db",
    http: "$.interface.http",
  },
  hooks: {
    async activate() {
      const verificationToken = uuid();
      this.setVerificationToken(verificationToken);

      const webhook = await this.dear.createWebhook({
        data: this.setupWebhookData(verificationToken),
      });

      const { ID: webhookId } = webhook;
      this.setWebhookId(webhookId);
    },
    async deactivate() {
      await this.dear.deleteWebhook({
        params: {
          ID: this.getWebhookId(),
        },
      });
    },
  },
  methods: {
    setWebhookId(webhookId) {
      this.db.set(constants.WEBHOOK_ID, webhookId);
    },
    getWebhookId() {
      return this.db.get(constants.WEBHOOK_ID);
    },
    setVerificationToken(verificationToken) {
      this.db.set(constants.VERIFICATION_TOKEN, verificationToken);
    },
    getVerificationToken() {
      return this.db.get(constants.VERIFICATION_TOKEN);
    },
    getWebhookType() {
      throw new Error("getWebhookType Not implemented");
    },
    getMetadata() {
      throw new Error("getMetadata Not implemented");
    },
    setupWebhookData(verificationToken) {
      return {
        Type: this.getWebhookType(),
        IsActive: true,
        ExternalURL: this.http.endpoint,
        ExternalAuthorizationType: "noauth",
        ExternalHeaders: [
          {
            Key: constants.VERIFICATION_TOKEN_HEADER,
            Value: verificationToken,
          },
        ],
      };
    },
    isValidSource(verificationToken) {
      return verificationToken === this.getVerificationToken();
    },
  },
  async run(event) {
    const payload = event.body;
    const {
      [constants.X_AMZN_TRACE_ID_HEADER]: amznTraceId,
      [constants.VERIFICATION_TOKEN_HEADER]: verificationToken,
    } = event.headers;

    if (!this.isValidSource(verificationToken)) {
      console.log("Skipping event from unrecognized source");
      return;
    }

    const metadata = this.getMetadata({
      ...payload,
      amznTraceId,
    });

    this.$emit(payload, metadata);
  },
};
