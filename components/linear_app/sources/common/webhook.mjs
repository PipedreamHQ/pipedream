import linearApp from "../../linear_app.app.mjs";
import constants from "../../common/constants.mjs";
import utils from "../../common/utils.mjs";

export default {
  props: {
    linearApp,
    teamIds: {
      label: "Team IDs",
      type: "string[]",
      propDefinition: [
        linearApp,
        "teamId",
      ],
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
    setWebhookId(teamId, id) {
      this.db.set(`webhook-${teamId}`, id);
    },
    getWebhookId(teamId) {
      return this.db.get(`webhook-${teamId}`);
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
    getMetadata() {
      throw new Error("getMetadata is not implemented");
    },
    getResourcesFn() {
      throw new Error("Get resource function not implemented");
    },
    getResourcesFnArgs() {
      throw new Error("Get resource function arguments not implemented");
    },
    getLoadedProjectId() {
      throw new Error("Get loaded project ID not implemented");
    },
  },
  hooks: {
    async deploy() {
      // Retrieve historical events
      console.log("Retrieving historical events...");
      const stream = this.linearApp.paginateResources({
        resourcesFn: this.getResourcesFn(),
        resourcesFnArgs: this.getResourcesFnArgs(),
      });
      const resources = await utils.streamIterator(stream);

      resources
        .reverse()
        .forEach((resource) => {
          this.$emit(resource, this.getMetadata(resource));
        });
    },
    async activate() {
      for (const teamId of this.teamIds) {
        const { _webhook: webhook } =
          await this.linearApp.createWebhook({
            teamId,
            resourceTypes: this.getResourceTypes(),
            url: this.http.endpoint,
            label: this.getWebhookLabel(),
          });
        this.setWebhookId(teamId, webhook.id);
      }
    },
    async deactivate() {
      for (const teamId of this.teamIds) {
        const webhookId = this.getWebhookId(teamId);
        if (webhookId) {
          await this.linearApp.deleteWebhook(webhookId);
        }
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

    const meta = this.getMetadata(resource);
    this.$emit(body, meta);
  },
};
