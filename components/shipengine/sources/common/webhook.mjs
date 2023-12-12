import common from "./base.mjs";
import constants from "../../common/constants.mjs";
import utils from "../../common/utils.mjs";

export default {
  ...common,
  props: {
    ...common.props,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
  },
  hooks: {
    async deploy() {
      const resourcesFn = this.getResourcesFn();
      if (!resourcesFn) {
        return;
      }
      console.log("Retrieving historical events...");
      const stream = this.app.getResourcesStream({
        resourcesFn,
        resourcesFnArgs: this.getResourcesFnArgs(),
        resourcesName: this.getResourcesName(),
      });
      const resources = await utils.streamIterator(stream);

      resources
        .reverse()
        .forEach((resource) =>
          this.$emit(resource, this.generateMeta(resource)));
    },
    async activate() {
      const { webhook_id: webhookId } =
        await this.createWebhook({
          data: {
            url: this.http.endpoint,
            event: this.getEvent(),
          },
        });

      this.setWebhookId(webhookId);
    },
    async deactivate() {
      const webhookId = this.getWebhookId();
      if (webhookId) {
        await this.deleteWebhook({
          webhookId,
        });
      }
    },
  },
  async run({
    body, headers,
  }) {
    const userAgent = headers["user-agent"];

    if (userAgent !== constants.USER_AGENT) {
      console.log("Invalid user-agent");
      return;
    }

    const {
      resource_url: url,
      data,
    } = body;

    this.http.respond({
      status: 200,
    });

    const response = data || await this.app.makeRequest({
      url,
    });

    await this.processEvents(response);
  },
};
