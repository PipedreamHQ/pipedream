import linearApp from "../../linear_app.app.mjs";
import constants from "../../common/constants.mjs";
import utils from "../../common/utils.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

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
      reloadProps: true,
    },
    projectId: {
      propDefinition: [
        linearApp,
        "projectId",
      ],
    },
    limit: {
      propDefinition: [
        linearApp,
        "limit",
      ],
      description: "Maximum number of items to return when polling. Defaults to 20 if not specified.",
    },
    db: "$.service.db",
  },
  async additionalProps() {
    const props = {};
    let msg;
    if (await this.isAdmin()) {
      msg = "Admin role detected. Trigger will be set up as a webhook.";
      props.http = "$.interface.http";
    } else {
      msg = "No admin role detected. Trigger will set up to use polling.";
      props.timer = {
        type: "$.interface.timer",
        default: {
          intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
        },
      };
    }
    props.alert = {
      type: "alert",
      alertType: "info",
      content: `${msg} See the Linear [documentation](https://linear.app/docs/api-and-webhooks#webhooks) for details.`,
    };
    return props;
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
    isRelevantPolling() {
      return true;
    },
    useGraphQl() {
      return true;
    },
    getResource() {
      throw new Error("getResource is not implemented");
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
    async isAdmin() {
      const { data } = await this.linearApp.makeAxiosRequest({
        method: "POST",
        data: {
          "query": `{ 
            user(id: "me") {
              admin
            }
          }`,
        },
      });
      return data?.user?.admin;
    },
    async emitPolledResources() {
      // Use the specified limit or default to a reasonable number
      const maxLimit = this.limit || constants.DEFAULT_NO_QUERY_LIMIT;

      const stream = this.linearApp.paginateResources({
        resourcesFn: this.getResourcesFn(),
        resourcesFnArgs: this.getResourcesFnArgs(),
        useGraphQl: this.useGraphQl(),
        max: maxLimit, // Apply the limit to pagination
      });
      const resources = await utils.streamIterator(stream);

      resources
        .reverse()
        .filter((resource) => this.isRelevantPolling(resource))
        .forEach((resource) => {
          this.$emit(resource, this.getMetadata(resource));
        });
    },
  },
  hooks: {
    async deploy() {
      // Retrieve historical events
      console.log("Retrieving historical events...");
      await this.emitPolledResources();
    },
    async activate() {
      if (await this.isAdmin()) {
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
      }
    },
    async deactivate() {
      if (await this.isAdmin()) {
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
      }
    },
  },
  async run(event) {
    if (!(await this.isAdmin())) {
      await this.emitPolledResources();
    } else {
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
      const item = await this.getResource(body.data);
      this.$emit(item, meta);
    }
  },
};
