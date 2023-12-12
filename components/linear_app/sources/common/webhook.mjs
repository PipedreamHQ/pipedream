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
    isFromProject(body) {
      return !this.projectId || body?.data?.projectId == this.projectId;
    },
    isRelevant() {
      return true;
    },
    useGraphQl() {
      return true;
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
        useGraphQl: this.useGraphQl(),
      });
      const resources = await utils.streamIterator(stream);

      resources
        .reverse()
        .forEach((resource) => {
          this.$emit(resource, this.getMetadata(resource));
        });
    },
    async activate() {
      const args = {
        resourceTypes: this.getResourceTypes(),
        url: this.http.endpoint,
        label: this.getWebhookLabel(),
      };
      if (!this.teamIds && !this.teamId) {
        args.allPublicTeams = true;
        const { _webhook: webhook } = await this.linearApp.createWebhook(args);
        this.setWebhookId("1", webhook.id);
        return;
      }
      const teamIds = this.teamIds || [
        this.teamId,
      ];
      for (const teamId of teamIds) {
        const { _webhook: webhook } =
          await this.linearApp.createWebhook({
            teamId,
            ...args,
          });
        this.setWebhookId(teamId, webhook.id);
      }
    },
    async deactivate() {
      if (!this.teamIds && !this.teamId) {
        const webhookId = this.getWebhookId("1");
        if (webhookId) {
          await this.linearApp.deleteWebhook(webhookId);
        }
        return;
      }
      const teamIds = this.teamIds || [
        this.teamId,
      ];
      for (const teamId of teamIds) {
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

    if (!(await this.isFromProject(body)) || !this.isRelevant(body)) {
      return;
    }

    const meta = this.getMetadata(resource);
    this.$emit(body, meta);
  },
};
