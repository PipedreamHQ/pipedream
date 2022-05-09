import linearApp from "../../linear_app.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  props: {
    linearApp,
    teamId: {
      propDefinition: [
        linearApp,
        "teamId",
      ],
      optional: true,
    },
    projectId: {
      propDefinition: [
        linearApp,
        "projectId",
      ],
    },
    http: "$.interface.http",
    db: "$.service.db",
  },
  methods: {
    setWebhookId(id) {
      this.db.set(constants.WEBHOOK_ID, id);
    },
    getWebhookId() {
      return this.db.get(constants.WEBHOOK_ID);
    },
    isRelevant(body) {
      if (!this.getActions().includes(body?.action)) {
        return false;
      }
      if (this.projectId) {
        return body.data.projectId === this.projectId;
      }
      return true;
    },
    isWebhookValid(clientIp) {
      return constants.CLIENT_IPS.includes(clientIp);
    },
    getResourceTypes() {
      throw new Error("getResourceTypes is not implemented");
    },
    getWebhookLabel() {
      throw new Error("getWebhookLabel is not implemented");
    },
    getActions() {
      throw new Error("getActions is not implemented");
    },
    getMetadata() {
      throw new Error("getMetadata is not implemented");
    },
  },
  hooks: {
    async activate() {
      const params = {
        resourceTypes: this.getResourceTypes(),
        url: this.http.endpoint,
        label: this.getWebhookLabel(),
      };

      if (this.teamId) {
        params.teamId = this.teamId;
      } else {
        params.allPublicTeams = true;
      }

      const { _webhook: webhook } = await this.linearApp.createWebhook(params);
      this.setWebhookId(webhook.id);
    },
    async deactivate() {
      const webhookId = this.getWebhookId();
      if (webhookId) {
        await this.linearApp.deleteWebhook(webhookId);
      }
    },
  },
  async run(event) {
    const {
      client_ip: clientIp,
      body,
      headers,
    } = event;

    const { [constants.LINEAR_DELIVERY_HEADER]: delivery } = headers;

    const resource = {
      ...body,
      delivery,
    };

    if (!this.isWebhookValid(clientIp)) {
      console.log("Webhook is not valid");
      return;
    }

    if (this.isRelevant(body)) {
      const meta = this.getMetadata(resource);
      this.$emit(body, meta);
    }
  },
};
