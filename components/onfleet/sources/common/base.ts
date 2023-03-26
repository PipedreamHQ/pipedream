import { axios } from "@pipedream/platform";
import onfleet from "../../app/onfleet.app";

export default {
  props: {
    onfleet,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    webhookName: {
      propDefinition: [
        onfleet,
        "webhookName",
      ],
    },
  },
  hooks: {
    async deploy() {
      await this.startDeploy();
    },
    async activate() {
      // workaround - self call run() because createWebhook() can't be run on activate or deploy
      await axios(this, {
        url: this.http.endpoint,
        method: "POST",
        params: {
          createHook: true,
        },
      });
    },
    async deactivate() {
      const webhookId = this._getHookId();
      if (webhookId) await this.onfleet.deleteWebhook(webhookId);
    },
  },
  methods: {
    _setHookId(hookId) {
      this.db.set("hookId", hookId);
    },
    _getHookId() {
      return this.db.get("hookId");
    },
    emitEvent(event) {
      const meta = this.generateMeta(event.body);
      this.$emit(event, meta);
    },
    async startDeploy() {
      // Retrieve historical events
      const items = this.onfleet.paginate({
        fn: this.getFn(),
        field: this.getField(),
        maxResults: 25,
      });
      const resources = [];

      for await (const item of items) {
        resources.push(item);
      }

      resources
        .reverse()
        .forEach((resource) => {
          this.$emit(resource, this.generateMeta(resource));
        });
    },
    async createHook() {
      const response = await this.onfleet.createWebhook({
        url: this.http.endpoint,
        name: this.webhookName,
        trigger: this.getTrigger(),
      });
      this._setHookId(response.id);
      return response;
    },
  },
  async run(event) {
    const responseData = {
      status: 200,
      body: "",
    };
    // createHook only on the first time
    if (event.query?.createHook) {
      await this.createHook();
    } else {
      if (event.body) await this.emitEvent(event);

      if (event.query?.check) {
        responseData.body = event.query.check;
      }
    }
    this.http.respond(responseData);
  },
};
