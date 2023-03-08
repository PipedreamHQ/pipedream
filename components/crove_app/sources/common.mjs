import croveApp from "../crove_app.app.mjs";
import { v4 as uuid } from "uuid";

export default {
  props: {
    croveApp,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    template_id: {
      propDefinition: [
        croveApp,
        "template_id",
      ],
    },
  },
  methods: {
    _getHookID() {
      return this.db.get("webhookId");
    },
    _setHookID(hookID) {
      this.db.set("webhookId", hookID);
    },
  },
  hooks: {
    async activate() {
      const validationToken = uuid();

      let config = {
        url: `${this.croveApp._getBaseUrl()}/webhooks/templates/create/`,
        method: "POST",
        data: {
          template: this.template_id,
          name: `pipedream-webhook: ${validationToken}`,
          webhook_url: this.http.endpoint,
          method: "POST",
          events: this.getEvents(),
        },
      };

      const response = await this.croveApp._makeRequest(config);

      this._setHookID(response.id);
    },
    async deactivate() {
      const webhookId = this._getHookID();
      let config = {
        url: `${this.croveApp._getBaseUrl()}/webhooks/templates/${webhookId}/`,
        method: "DELETE",
      };
      await this.croveApp._makeRequest(config);
    },
  },
  async run(event) {
    const { body } = event;

    this.http.respond({
      status: 200,
    });
 
    if (body.payload && body.payload.document) {
      // if body has payload.document.response, delete it
      if(body.payload.document.response) {
        delete body.payload.document.response;
      }
      // if body has payload.document.respondenets, delete it
      if(body.payload.document.respondents) {
        delete body.payload.document.respondents;
      }
      // if body has payload.document.symbol_table, delete it
      if(body.payload.document.symbol_table) {
        delete body.payload.document.symbol_table;
      }
    }

    this.$emit(body, {
      id: body.webhook.id,
      summary: `New event ${body.webhook.id} received`,
      ts: new Date(),
    });
  },
};
